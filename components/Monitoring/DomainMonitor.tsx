"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus, FaCircleNotch, FaShieldHalved } from "react-icons/fa6";
import MonitorSummary from "./MonitorSummary";
import DomainMonitorCard from "./DomainMonitorCard";
import UpgradeBanner from "@/components/Dashboard/UpgradeBanner";
import {
  addMonitorDomains,
  pollStatus,
  rescanDomain,
} from "@/lib/domain-helper";
import {
  STATE_META,
  visualState,
  type MonitorDomain,
  type MonitorStatus,
  type MonitorSummary as Summary,
} from "@/lib/monitor-status";
import type { UserPlan } from "@/lib/plan";

interface Props {
  initialDomains: MonitorDomain[];
  initialSummary: Summary;
  initialPlan?: UserPlan;
}

/** Recompute the metric-card counts from the current list (client-side truth). */
function computeSummary(list: MonitorDomain[]): Summary {
  let scanning = 0;
  let needReview = 0;
  let clear = 0;
  for (const d of list) {
    if (d.scan_status === "scanning") scanning += 1;
    else if ((d.no_of_items ?? 0) > 0) needReview += 1;
    else if (d.scan_status === "scanned") clear += 1;
  }
  return { monitored: list.length, scanning, needReview, clear };
}

const DomainMonitor = ({ initialDomains, initialSummary, initialPlan }: Props) => {
  const [domains, setDomains] = useState<MonitorDomain[]>(initialDomains);
  const [summary, setSummary] = useState<Summary>(initialSummary);
  const [plan, setPlan] = useState<UserPlan | undefined>(initialPlan);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [announcement, setAnnouncement] = useState<string>("");
  const [retryingIds, setRetryingIds] = useState<number[]>([]);

  const domainsRef = useRef(domains);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const triggeredRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    domainsRef.current = domains;
  }, [domains]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 4500);
  }, []);

  const mergeStatuses = useCallback((statuses: MonitorStatus[]) => {
    if (!statuses?.length) return;
    const map = new Map(statuses.map((s) => [s.id, s]));
    setDomains((prev) => {
      const next = prev.map((d) => {
        const s = map.get(d.id);
        if (!s) return d;
        // Keep a client "failed" overlay until a real resolution arrives.
        if (d.scan_status === "failed" && s.scan_status === "scanning") return d;
        if (d.scan_status === "scanning" && s.scan_status === "scanned") {
          const label = STATE_META[visualState({ scan_status: "scanned", risk_level: s.risk_level })].label;
          setAnnouncement(`${d.domain_name}: ${label}`);
        }
        return {
          ...d,
          scan_status: s.scan_status,
          risk_level: s.risk_level,
          no_of_items: s.no_of_items,
          last_scanned_at: s.last_scanned_at,
          top_owner: s.top_owner,
        };
      });
      setSummary(computeSummary(next));
      return next;
    });
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const ensurePolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      const ids = domainsRef.current
        .filter((d) => d.scan_status === "scanning")
        .map((d) => d.id);
      if (ids.length === 0) {
        stopPolling();
        return;
      }
      const res = await pollStatus(ids);
      if (res?.statuses) mergeStatuses(res.statuses);
    }, 3000);
  }, [mergeStatuses, stopPolling]);

  // Kick the actual USPTO scan for a domain, then reconcile its status.
  const triggerScan = useCallback(
    async (id: number) => {
      try {
        const res = await rescanDomain(id);
        const skipped = res?.result?.skipped;
        if (skipped) {
          setDomains((prev) => prev.map((d) => (d.id === id ? { ...d, scan_status: "failed" } : d)));
          const name = domainsRef.current.find((d) => d.id === id)?.domain_name ?? "Domain";
          setAnnouncement(`${name}: scan didn\u2019t complete`);
          return;
        }
        const poll = await pollStatus([id]);
        if (poll?.statuses) mergeStatuses(poll.statuses);
      } catch {
        setDomains((prev) => prev.map((d) => (d.id === id ? { ...d, scan_status: "failed" } : d)));
      }
    },
    [mergeStatuses],
  );

  // On mount + whenever the list changes: start scans for any not-yet-triggered
  // "scanning" rows (self-healing) and make sure the poll loop is running.
  useEffect(() => {
    const scanning = domains.filter((d) => d.scan_status === "scanning");
    let started = false;
    for (const d of scanning) {
      if (!triggeredRef.current.has(d.id)) {
        triggeredRef.current.add(d.id);
        started = true;
        triggerScan(d.id);
      }
    }
    if (scanning.length > 0) ensurePolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domains]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const handleRetry = useCallback(
    (id: number) => {
      setRetryingIds((prev) => [...prev, id]);
      triggeredRef.current.delete(id);
      setDomains((prev) => prev.map((d) => (d.id === id ? { ...d, scan_status: "scanning" } : d)));
      triggerScan(id).finally(() => {
        setRetryingIds((prev) => prev.filter((x) => x !== id));
      });
      ensurePolling();
    },
    [triggerScan, ensurePolling],
  );

  const handleAdd = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const value = input.trim();
      if (!value || adding) return;
      setAdding(true);
      try {
        const res = await addMonitorDomains(value);
        if (res?.unauthenticated) {
          showToast("Your session expired — please sign in again.");
          return;
        }
        // Reflect new usage / limit in the plan so the upgrade CTA updates live.
        if (res && (res.planUsed != null || res.limitReached != null)) {
          setPlan((prev) =>
            prev
              ? {
                  ...prev,
                  used: res.planUsed ?? prev.used,
                  limitReached: res.limitReached ?? prev.limitReached,
                  remaining:
                    prev.end_limit == null
                      ? null
                      : Math.max(0, prev.end_limit - (res.planUsed ?? prev.used)),
                }
              : prev,
          );
        }

        const created: MonitorDomain[] = res?.created ?? [];
        if (created.length) {
          setDomains((prev) => {
            const next = [...created, ...prev];
            setSummary(computeSummary(next));
            return next;
          });
          const names = created.map((d) => d.domain_name).join(", ");
          showToast(`${names} added \u2014 scanning for trademark conflicts.`);
          setInput("");
          ensurePolling();
        }
        // Surface skipped / plan messaging from the server.
        if (!created.length || res?.skipped?.length) {
          showToast(res?.message || "Nothing added.");
        }
      } catch {
        showToast("Couldn\u2019t add domains. Please try again.");
      } finally {
        setAdding(false);
      }
    },
    [input, adding, showToast, ensurePolling],
  );

  const isEmpty = domains.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* aria-live region for screen readers (scanning -> resolved transitions) */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-6 z-999 max-w-sm rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-black shadow-4 dark:border-strokedark dark:bg-boxdark dark:text-white">
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
          <FaShieldHalved className="h-6 w-6 text-brand" />
          Domain monitoring
        </h2>
        <p className="text-sm text-body dark:text-bodydark">
          We watch your domains against the USPTO trademark database and flag potential conflicts.
        </p>
      </div>

      <MonitorSummary summary={summary} />

      {plan ? <UpgradeBanner plan={plan} force={plan.limitReached} /> : null}

      {/* Add bar */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-xl border border-stroke bg-white p-4 shadow-card dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add domains to monitor (comma-separated, e.g. acme.com, brandx.io)"
          className="w-full flex-1 rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input"
        />
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
        >
          {adding ? <FaCircleNotch className="h-4 w-4 animate-spin" /> : <FaPlus className="h-4 w-4" />}
          Add &amp; scan
        </button>
      </form>

      {/* List / empty state */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-stroke bg-white px-6 py-16 text-center dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
            <FaShieldHalved className="h-7 w-7 text-brand" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">No domains monitored yet</h3>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              Add your first domain to start monitoring for trademark conflicts.
            </p>
          </div>
          <button
            onClick={() => handleAdd()}
            disabled={!input.trim() || adding}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
          >
            <FaPlus className="h-4 w-4" />
            Add your first domain
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {domains.map((d) => (
            <DomainMonitorCard
              key={d.id}
              domain={d}
              retrying={retryingIds.includes(d.id)}
              onRetry={handleRetry}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DomainMonitor;
