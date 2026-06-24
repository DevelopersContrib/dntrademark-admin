/**
 * Trademark report taxonomy — the pure logic behind the domain report page.
 *
 * Shared by the server (report query + email HTML builder) and the client
 * (DomainReport component) so the "Live / Registered", "Dead / Abandoned",
 * "Exact / Partial" and risk classifications are derived in exactly one place.
 *
 * Pure module: no server-only imports, safe in client components.
 */

import type { RiskLevel } from "./monitor-status";

/** One trademark match, in the shape the report consumes (flat, owner inlined). */
export interface ReportItem {
  id: number;
  keyword: string;
  registration_number: string | null;
  serial_number: string | null;
  status_label: string | null;
  status_definition: string | null;
  status_date: string | null;
  filing_date: string | null;
  registration_date: string | null;
  abandonment_date: string | null;
  expiration_date: string | null;
  description: string | null;
  owner_name: string | null;
}

/** Headline counts shown in the metric tiles. */
export interface ReportSummary {
  total: number;
  live: number;
  exact: number;
  owners: number;
}

/** The full payload the report page renders. */
export interface DomainReport {
  domain: {
    id: number;
    domain_name: string;
    no_of_items: number | null;
    last_scanned_at: string | null;
  };
  items: ReportItem[];
  summary: ReportSummary;
  risk_level: RiskLevel;
}

export type MarkLife = "live" | "dead";
export type MarkMatch = "exact" | "partial";
export type MarkTone = "danger" | "warning" | "muted";

/** Resolved visual state of a single mark. */
export interface MarkState {
  life: MarkLife;
  /** Short state word: Registered / Pending / Abandoned / Cancelled / Expired. */
  state: string;
  /** Combined badge label, e.g. "Live \u00b7 Registered". */
  label: string;
  tone: MarkTone;
}

/** Derive the comparable keyword from a domain name: strip TLD + lowercase. */
export function reportKeyword(domainName: string): string {
  const bare = (domainName || "").trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  return bare.split(".")[0] || bare;
}

const normalize = (s: string | null | undefined): string =>
  (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Collapse the USPTO status label + definition into a Live/Dead + state badge.
 * We read free-text status fields because the live DB stores them verbatim.
 */
export function deriveMarkState(item: Pick<ReportItem, "status_label" | "status_definition">): MarkState {
  const s = `${item.status_label || ""} ${item.status_definition || ""}`.toLowerCase();
  const dead = /(abandon|dead|cancel|expir|inactive)/.test(s);

  if (dead) {
    const state = /abandon/.test(s)
      ? "Abandoned"
      : /cancel/.test(s)
        ? "Cancelled"
        : /expir/.test(s)
          ? "Expired"
          : "Inactive";
    return { life: "dead", state, label: `Dead \u00b7 ${state}`, tone: "muted" };
  }

  const registered = /regist/.test(s);
  if (registered) {
    return { life: "live", state: "Registered", label: "Live \u00b7 Registered", tone: "danger" };
  }

  // Anything live but not yet registered reads as a pending application.
  return { life: "live", state: "Pending", label: "Live \u00b7 Pending", tone: "warning" };
}

/** Exact = the mark wording matches the domain label; otherwise partial. */
export function matchType(item: Pick<ReportItem, "keyword">, domainName: string): MarkMatch {
  const mark = normalize(item.keyword);
  const domain = normalize(reportKeyword(domainName));
  return mark && domain && mark === domain ? "exact" : "partial";
}

/** Compute the headline summary counts for a set of items. */
export function summarize(items: ReportItem[], domainName: string): ReportSummary {
  let live = 0;
  let exact = 0;
  const owners = new Set<string>();
  for (const it of items) {
    if (deriveMarkState(it).life === "live") live += 1;
    if (matchType(it, domainName) === "exact") exact += 1;
    const o = (it.owner_name || "").trim();
    if (o) owners.add(o.toLowerCase());
  }
  return { total: items.length, live, exact, owners: owners.size };
}

/**
 * Domain-level risk:
 *  - action  : at least one live mark that exactly matches the domain
 *  - review  : at least one live mark (partial)
 *  - clear   : nothing live
 */
export function computeRisk(items: ReportItem[], domainName: string): RiskLevel {
  let hasLive = false;
  for (const it of items) {
    if (deriveMarkState(it).life !== "live") continue;
    hasLive = true;
    if (matchType(it, domainName) === "exact") return "action";
  }
  return hasLive ? "review" : "clear";
}

/** Badge colour classes per tone (text + background). */
export const MARK_BADGE: Record<MarkTone, { text: string; bg: string }> = {
  danger: { text: "text-danger", bg: "bg-danger/10" },
  warning: { text: "text-[#b45309]", bg: "bg-[#f59e0b]/15" },
  muted: { text: "text-body", bg: "bg-body/10" },
};

/** One-line headline for the action banner / email subject. */
export function riskHeadline(report: Pick<DomainReport, "risk_level" | "summary">): {
  title: string;
  detail: string;
} {
  const { risk_level, summary } = report;
  if (risk_level === "action") {
    const n = summary.exact;
    return {
      title: "Action needed",
      detail: `${n} exact live mark${n === 1 ? "" : "s"} \u2014 review before use.`,
    };
  }
  if (risk_level === "review") {
    const n = summary.live;
    return {
      title: "Potential conflicts",
      detail: `${n} live mark${n === 1 ? "" : "s"} worth reviewing.`,
    };
  }
  return { title: "No conflicts found", detail: "No live conflicting marks for this domain." };
}

/** Format a date string to "MMM YYYY" / "MMM D, YYYY" for compact display. */
export function reportYear(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "";
  return String(d.getFullYear());
}

/** External USPTO TSDR status URL for a serial number. */
export function usptoUrl(item: Pick<ReportItem, "serial_number" | "registration_number">): string {
  const serial = (item.serial_number || "").replace(/\D/g, "");
  if (serial && serial !== "0000000") {
    return `https://tsdr.uspto.gov/#caseNumber=${serial}&caseType=SERIAL_NO&searchType=statusSearch`;
  }
  const reg = (item.registration_number || "").replace(/\D/g, "");
  if (reg && reg !== "0000000") {
    return `https://tsdr.uspto.gov/#caseNumber=${reg}&caseType=US_REGISTRATION_NO&searchType=statusSearch`;
  }
  return "https://tmsearch.uspto.gov/";
}
