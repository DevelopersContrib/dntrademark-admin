"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePDF, Margin } from "react-to-pdf";
import {
  FiRefreshCw,
  FiMail,
  FiDownload,
  FiExternalLink,
  FiAlertOctagon,
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiLoader,
} from "react-icons/fi";
import { rescanDomain, emailReport } from "@/lib/domain-helper";
import {
  deriveMarkState,
  matchType,
  usptoUrl,
  riskHeadline,
  reportYear,
  MARK_BADGE,
  type DomainReport as DomainReportData,
  type ReportItem,
} from "@/lib/report";
import { monitoringTrustLine } from "@/lib/monitor-status";

interface Props {
  report: DomainReportData;
}

type Notice = { tone: "ok" | "err"; text: string } | null;

const BANNER: Record<
  "action" | "review" | "clear",
  { bg: string; border: string; text: string; icon: JSX.Element }
> = {
  action: {
    bg: "bg-danger/10",
    border: "border-danger/30",
    text: "text-danger",
    icon: <FiAlertOctagon className="h-5 w-5 shrink-0" />,
  },
  review: {
    bg: "bg-[#f59e0b]/10",
    border: "border-[#f59e0b]/30",
    text: "text-[#b45309]",
    icon: <FiAlertTriangle className="h-5 w-5 shrink-0" />,
  },
  clear: {
    bg: "bg-meta-3/10",
    border: "border-meta-3/30",
    text: "text-meta-3",
    icon: <FiCheckCircle className="h-5 w-5 shrink-0" />,
  },
};

const Badge = ({ text, tone }: { text: string; tone: "danger" | "warning" | "muted" }) => {
  const c = MARK_BADGE[tone];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}>
      {text}
    </span>
  );
};

const MarkCard = ({ item, domainName }: { item: ReportItem; domainName: string }) => {
  const state = deriveMarkState(item);
  const match = matchType(item, domainName);
  const filed = reportYear(item.filing_date);
  const reg = reportYear(item.registration_date);
  const abandoned = reportYear(item.abandonment_date);

  const ownerBits = [
    item.owner_name,
    item.serial_number && item.serial_number !== "0000000" ? `Serial ${item.serial_number}` : null,
    item.registration_number && item.registration_number !== "0000000" ? `Reg ${item.registration_number}` : null,
  ].filter(Boolean);

  return (
    <div className="rounded-xl border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-black dark:text-white">{item.keyword || "\u2014"}</h3>
            <Badge text={state.label} tone={state.tone} />
            <Badge text={match === "exact" ? "Exact match" : "Partial"} tone={match === "exact" ? "danger" : "muted"} />
          </div>
          {ownerBits.length > 0 && (
            <p className="mt-2 text-sm text-body dark:text-bodydark">
              {ownerBits.map((b, i) => (
                <span key={i}>
                  {i > 0 && <span className="px-1.5 text-[#cbd1dd]">&middot;</span>}
                  {b}
                </span>
              ))}
            </p>
          )}
          {state.life === "dead" && (
            <p className="mt-1 text-xs text-body dark:text-bodydark">No longer enforceable</p>
          )}
        </div>
        <div className="shrink-0 text-right text-xs text-body dark:text-bodydark">
          {filed && <div>Filed {filed}</div>}
          {state.life === "dead" && abandoned ? (
            <div>Abandoned {abandoned}</div>
          ) : (
            reg && <div>Reg {reg}</div>
          )}
        </div>
      </div>

      <div className="no-print mt-4 flex flex-wrap items-center gap-2.5">
        <Link
          href={`/domains/items/protest/${item.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stroke px-3.5 py-2 text-sm font-medium text-black hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
        >
          <FiFileText className="h-4 w-4" /> File letter of protest
        </Link>
        <a
          href={usptoUrl(item)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stroke px-3.5 py-2 text-sm font-medium text-black hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
        >
          <FiExternalLink className="h-4 w-4" /> View on USPTO
        </a>
      </div>
    </div>
  );
};

const Tile = ({ label, value, accent }: { label: string; value: number; accent?: string }) => (
  <div className="rounded-xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
    <div className="text-xs font-medium uppercase tracking-wide text-body dark:text-bodydark">{label}</div>
    <div className={`mt-1 text-2xl font-bold ${accent || "text-black dark:text-white"}`}>{value}</div>
  </div>
);

const DomainReport = ({ report }: Props) => {
  const router = useRouter();
  const { domain, summary, items, risk_level } = report;
  const [rescanning, setRescanning] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const { toPDF, targetRef } = usePDF({
    filename: `${domain.domain_name}-trademark-report.pdf`,
    method: "save",
    page: { format: "a4", margin: Margin.SMALL, orientation: "portrait" },
    resolution: 2,
  });

  const head = riskHeadline(report);
  const banner = BANNER[risk_level];

  const flash = (n: Notice) => {
    setNotice(n);
    if (n) setTimeout(() => setNotice(null), 5000);
  };

  const sorted = useMemo(() => items, [items]);

  const handleRescan = async () => {
    setRescanning(true);
    flash(null);
    try {
      const res = await rescanDomain(domain.id);
      if (res?.error) {
        flash({ tone: "err", text: res.error });
      } else {
        flash({ tone: "ok", text: "Rescan complete \u2014 report updated." });
        router.refresh();
      }
    } catch {
      flash({ tone: "err", text: "Rescan failed. Please try again." });
    } finally {
      setRescanning(false);
    }
  };

  const handleEmail = async () => {
    setEmailing(true);
    flash(null);
    try {
      const res = await emailReport(domain.id);
      if (res?.success) {
        flash({ tone: "ok", text: `Report emailed to ${res.to || "your inbox"}.` });
      } else {
        flash({ tone: "err", text: res?.error || "Could not send email." });
      }
    } catch {
      flash({ tone: "err", text: "Could not send email." });
    } finally {
      setEmailing(false);
    }
  };

  return (
    <>
      {/* Header + actions */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <nav className="mb-1.5 text-sm">
            <ol className="flex items-center gap-1.5 text-body dark:text-bodydark">
              <li>
                <Link href="/" className="hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/domains/all" className="hover:text-primary">
                  Domains
                </Link>
              </li>
              <li>/</li>
              <li className="text-black dark:text-white">Report</li>
            </ol>
          </nav>
          <h1 className="text-title-md2 font-bold text-black dark:text-white">{domain.domain_name}</h1>
          <p className="mt-1 text-sm text-body dark:text-bodydark">{monitoringTrustLine(domain.last_scanned_at)}</p>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRescan}
            disabled={rescanning}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm font-medium text-black hover:border-primary hover:text-primary disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            {rescanning ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiRefreshCw className="h-4 w-4" />}
            {rescanning ? "Rescanning\u2026" : "Rescan"}
          </button>
          <button
            onClick={handleEmail}
            disabled={emailing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm font-medium text-black hover:border-primary hover:text-primary disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            {emailing ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiMail className="h-4 w-4" />}
            Email me
          </button>
          <button
            onClick={() => toPDF()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            <FiDownload className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`no-print mb-4 rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "ok"
              ? "border-meta-3/30 bg-meta-3/10 text-meta-3"
              : "border-danger/30 bg-danger/10 text-danger"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Printable / PDF region */}
      <div ref={targetRef} className="rounded-2xl bg-transparent">
        {/* Action banner */}
        <div className={`mb-5 flex items-start gap-3 rounded-xl border px-5 py-4 ${banner.bg} ${banner.border} ${banner.text}`}>
          {banner.icon}
          <div>
            <p className="text-sm font-semibold">{head.title}</p>
            <p className="text-sm">{head.detail}</p>
          </div>
        </div>

        {/* Summary tiles */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Tile label="Total marks" value={summary.total} />
          <Tile label="Live" value={summary.live} accent="text-meta-5" />
          <Tile
            label="Exact"
            value={summary.exact}
            accent={summary.exact > 0 ? "text-danger" : "text-black dark:text-white"}
          />
          <Tile label="Owners" value={summary.owners} />
        </div>

        {/* Marks */}
        {sorted.length > 0 ? (
          <div className="flex flex-col gap-4">
            {sorted.map((item) => (
              <MarkCard key={item.id} item={item} domainName={domain.domain_name} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-stroke bg-white px-6 py-16 text-center dark:border-strokedark dark:bg-boxdark">
            <FiCheckCircle className="mb-3 h-10 w-10 text-meta-3" />
            <h3 className="text-lg font-semibold text-black dark:text-white">No conflicting trademarks found</h3>
            <p className="mt-1 max-w-md text-sm text-body dark:text-bodydark">
              We scanned the USPTO database and found no live marks matching this domain. We&rsquo;ll keep monitoring
              daily and alert you if that changes.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DomainReport;
