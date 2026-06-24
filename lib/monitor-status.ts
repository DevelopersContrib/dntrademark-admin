/**
 * Domain-monitoring status taxonomy — the single "spine" reused on the
 * monitoring cards, the summary metric cards, and (later) the report page.
 *
 * Pure module: no server-only imports, safe to use in client components.
 *
 * NOTE: the live `domains` table has no `scan_status` / `risk_level` /
 * `last_scanned_at` columns (only id, user_id, domain_name, status,
 * date_last_crawled, no_of_items, is_cron, timestamps). These values are
 * therefore DERIVED server-side in lib/db-queries.ts and shaped to match the
 * future API contract, so the UI never has to change when those columns land.
 * TODO(api): replace derivation with real columns once the API/DB expose them.
 */

export type ScanStatus = "scanning" | "scanned" | "failed";
export type RiskLevel = "clear" | "review" | "action";

/** A monitored domain, in the shape the UI consumes. */
export interface MonitorDomain {
  id: number;
  domain_name: string;
  no_of_items: number | null;
  scan_status: ScanStatus;
  risk_level: RiskLevel | null;
  last_scanned_at: string | null;
  top_owner: string | null;
}

/** Lightweight status payload returned by the poll endpoint. */
export interface MonitorStatus {
  id: number;
  scan_status: ScanStatus;
  risk_level: RiskLevel | null;
  no_of_items: number | null;
  last_scanned_at: string | null;
  top_owner: string | null;
}

/** Summary counts for the metric-card row. */
export interface MonitorSummary {
  monitored: number;
  clear: number;
  needReview: number;
  scanning: number;
}

/** The resolved visual state of a card (status taxonomy spine). */
export type VisualState = "scanning" | "clear" | "review" | "action" | "failed";

/** Collapse scan_status + risk_level into a single visual state. */
export function visualState(d: Pick<MonitorDomain, "scan_status" | "risk_level">): VisualState {
  if (d.scan_status === "failed") return "failed";
  if (d.scan_status === "scanning") return "scanning";
  return d.risk_level ?? "clear";
}

export interface StateMeta {
  /** Short status label (always paired with an icon — never color alone). */
  label: string;
  /** Icon key the card maps to a react-icon. */
  icon: "spinner" | "check" | "triangle" | "octagon" | "retry";
  /** Badge text colour class. */
  text: string;
  /** Badge background colour class. */
  bg: string;
  /** Accent border colour class (card left edge / progress). */
  accent: string;
}

/**
 * Visual metadata per state. Microcopy is deliberate: we say "potential
 * conflict", never "infringement" — we surface signals, not legal conclusions.
 */
export const STATE_META: Record<VisualState, StateMeta> = {
  scanning: {
    label: "Scanning USPTO\u2026",
    icon: "spinner",
    text: "text-brand",
    bg: "bg-brand/10",
    accent: "bg-brand",
  },
  clear: {
    label: "No conflicts found",
    icon: "check",
    text: "text-meta-3",
    bg: "bg-meta-3/10",
    accent: "bg-meta-3",
  },
  review: {
    label: "Potential conflict",
    icon: "triangle",
    text: "text-[#b45309]",
    bg: "bg-[#f59e0b]/15",
    accent: "bg-[#f59e0b]",
  },
  action: {
    label: "Action needed",
    icon: "octagon",
    text: "text-danger",
    bg: "bg-danger/10",
    accent: "bg-danger",
  },
  failed: {
    label: "Scan didn\u2019t complete",
    icon: "retry",
    text: "text-body",
    bg: "bg-body/10",
    accent: "bg-body",
  },
};

/** Round a possibly-null count for display. */
export function roundCount(n: number | null | undefined): number {
  if (n == null || !Number.isFinite(n)) return 0;
  return Math.round(n);
}

/** Human "time ago" for a date string, or an em dash when missing. */
export function relativeTime(value: string | null | undefined): string {
  if (!value) return "\u2014";
  const then = new Date(value).getTime();
  if (!Number.isFinite(then)) return "\u2014";
  const diff = Date.now() - then;
  if (diff < 0) return "just now";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

/** Trust line shown on resolved cards. Cron runs daily, hence "24h". */
export function monitoringTrustLine(lastScannedAt: string | null | undefined): string {
  return `Monitoring active \u00b7 last scanned ${relativeTime(lastScannedAt)} \u00b7 next scan in 24h`;
}

/**
 * Build the one-line summary used inside a resolved card, e.g.
 * "3 potential marks \u00b7 top owner Venture Holdings LLC".
 */
export function resultSummary(d: MonitorDomain): string {
  const n = roundCount(d.no_of_items);
  const state = visualState(d);
  if (state === "clear") return "No conflicting marks";
  if (state === "action") {
    return d.top_owner ? `Exact live mark \u00b7 owner ${d.top_owner}` : "Exact live mark \u00b7 same class";
  }
  const marks = `${n} potential mark${n === 1 ? "" : "s"}`;
  return d.top_owner ? `${marks} \u00b7 top owner ${d.top_owner}` : marks;
}
