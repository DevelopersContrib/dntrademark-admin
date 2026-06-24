import React from "react";
import Link from "next/link";
import {
  FaCircleNotch,
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleExclamation,
  FaArrowsRotate,
} from "react-icons/fa6";
import {
  STATE_META,
  visualState,
  resultSummary,
  monitoringTrustLine,
  type MonitorDomain,
  type VisualState,
} from "@/lib/monitor-status";

interface Props {
  domain: MonitorDomain;
  retrying?: boolean;
  onRetry: (id: number) => void;
}

function StateIcon({ state, className }: { state: VisualState; className?: string }) {
  switch (STATE_META[state].icon) {
    case "spinner":
      return <FaCircleNotch className={`${className} animate-spin`} />;
    case "check":
      return <FaCircleCheck className={className} />;
    case "triangle":
      return <FaTriangleExclamation className={className} />;
    case "octagon": // red "action needed" marker
      return <FaCircleExclamation className={className} />;
    case "retry":
      return <FaArrowsRotate className={className} />;
    default:
      return null;
  }
}

const DomainMonitorCard = ({ domain, retrying, onRetry }: Props) => {
  const state = visualState(domain);
  const meta = STATE_META[state];
  const isScanning = state === "scanning";
  const isFailed = state === "failed";
  const isResolved = !isScanning && !isFailed;

  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-stroke bg-white px-5 py-4 shadow-card transition hover:shadow-4 dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center sm:gap-4">
      <span className={`absolute left-0 top-0 h-full w-1 ${meta.accent}`} aria-hidden="true" />

      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}>
        <StateIcon state={state} className={`h-5 w-5 ${meta.text}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h5 className="truncate font-semibold text-black dark:text-white">{domain.domain_name}</h5>
        </div>

        {/* aria-live so the scanning -> resolved transition is announced */}
        <p className={`mt-0.5 text-sm ${meta.text}`} aria-live="polite">
          <span className="font-medium">{meta.label}</span>
          {isResolved && (
            <span className="text-body dark:text-bodydark"> {"\u00b7"} {resultSummary(domain)}</span>
          )}
          {isScanning && <span className="text-body dark:text-bodydark"> {"\u00b7"} Setting up monitoring</span>}
          {isFailed && <span className="text-body dark:text-bodydark"> {"\u00b7"} retry pending</span>}
        </p>

        {isScanning ? (
          <div className="mt-2 h-1 w-full max-w-[260px] overflow-hidden rounded-full bg-stroke dark:bg-strokedark">
            <div className="h-full w-1/3 animate-monitorbar rounded-full bg-brand" />
          </div>
        ) : isResolved ? (
          <p className="mt-1 text-xs text-body dark:text-bodydark">
            {monitoringTrustLine(domain.last_scanned_at)}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:justify-end">
        <span
          className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium md:inline-flex ${meta.bg} ${meta.text}`}
        >
          <StateIcon state={state} className="h-3.5 w-3.5" />
          {meta.label}
        </span>

        {isFailed ? (
          <button
            onClick={() => onRetry(domain.id)}
            disabled={retrying}
            className="inline-flex items-center gap-2 rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:bg-primary hover:text-white disabled:opacity-50 dark:border-strokedark dark:text-white"
          >
            {retrying ? <FaCircleNotch className="h-4 w-4 animate-spin" /> : <FaArrowsRotate className="h-4 w-4" />}
            Retry now
          </button>
        ) : isResolved ? (
          <Link
            href={`/domains/items/${domain.id}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
          >
            View report
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand">
            <FaCircleNotch className="h-3.5 w-3.5 animate-spin" />
            Scanning
          </span>
        )}
      </div>
    </div>
  );
};

export default DomainMonitorCard;
