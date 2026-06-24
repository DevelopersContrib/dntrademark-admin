/**
 * Direct-DB query layer for the admin dashboard.
 *
 * Mirrors the SQL + response shapes of api-dntrademark, but keyed on the
 * NextAuth session user id instead of a Sanctum bearer token. This is the
 * single source of these queries inside the admin app — both the server
 * components (lib/data.tsx) and the client BFF routes (app/api/*) call into it.
 */
import { getServerSession } from "next-auth/next";
import { options } from "@/lib/options";
import { query, queryOne, execute } from "@/lib/db";
import type { MonitorDomain, MonitorStatus, MonitorSummary } from "@/lib/monitor-status";
import type { UserPlan } from "@/lib/plan";
import type { DomainReport, ReportItem } from "@/lib/report";
import { summarize, computeRisk } from "@/lib/report";

/** Resolve the authenticated user's numeric DB id from the session, or null. */
export async function getSessionUserId(): Promise<number | null> {
  const session = await getServerSession(options);
  const raw = session?.id;
  if (raw == null) return null;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export interface ListOpts {
  limit?: number;
  page?: number;
  sortBy?: string;
  orderBy?: string;
  filter?: string;
  filterBy?: string;
}

interface Paginator<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

function paginate<T>(rows: T[], page: number, limit: number, total: number): Paginator<T> {
  return {
    data: rows,
    current_page: page,
    per_page: limit,
    total,
    last_page: Math.max(1, Math.ceil(total / limit)),
  };
}

const DOMAIN_SORT = ["domain_name", "no_of_items", "created_at", "updated_at", "status", "id"];
const DOMAIN_FILTER = ["domain_name", "status"];
const ITEM_SORT = ["domain_id", "keyword", "serial_number", "status_label", "created_at", "updated_at", "id"];
const ITEM_FILTER = ["keyword", "serial_number", "status_label"];
const INVOICE_SORT = ["id", "status", "due_date", "created_at", "package_amount"];

function safeSort(value: string | undefined, allowed: string[], fallback: string): string {
  return value && allowed.includes(value) ? value : fallback;
}

function safeOrder(value: string | undefined): "ASC" | "DESC" {
  return (value || "").toUpperCase() === "ASC" ? "ASC" : "DESC";
}

function normPage(opts: ListOpts): { limit: number; page: number; offset: number } {
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const page = opts.page && opts.page > 0 ? opts.page : 1;
  return { limit, page, offset: (page - 1) * limit };
}

/** All of a user's domains (mirrors GET /domains). */
export async function listDomains(userId: number, opts: ListOpts = {}) {
  const { limit, page, offset } = normPage(opts);
  const sortBy = safeSort(opts.sortBy, DOMAIN_SORT, "domain_name");
  const orderBy = safeOrder(opts.orderBy);
  const filterBy = safeSort(opts.filterBy, DOMAIN_FILTER, "domain_name");
  const search = opts.filter;

  const where = search ? `WHERE user_id = ? AND ${filterBy} LIKE ?` : "WHERE user_id = ?";
  const params = search ? [userId, `%${search}%`] : [userId];

  const rows = await query(
    `SELECT * FROM domains ${where} ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  const cnt = await queryOne<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM domains ${where}`, params);
  return paginate(rows, page, limit, cnt?.cnt || 0);
}

/** Domains with at least one trademark hit (mirrors GET /domains/hits). */
export async function listDomainsWithHits(userId: number, opts: ListOpts = {}) {
  const { limit, page, offset } = normPage(opts);
  const sortBy = safeSort(opts.sortBy, DOMAIN_SORT, "domain_name");
  const orderBy = safeOrder(opts.orderBy);
  const filterBy = safeSort(opts.filterBy, DOMAIN_FILTER, "domain_name");
  const search = opts.filter;

  const where = search
    ? `WHERE user_id = ? AND no_of_items > 0 AND ${filterBy} LIKE ?`
    : "WHERE user_id = ? AND no_of_items > 0";
  const params = search ? [userId, `%${search}%`] : [userId];

  const rows = await query(
    `SELECT * FROM domains ${where} ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  const cnt = await queryOne<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM domains ${where}`, params);
  return paginate(rows, page, limit, cnt?.cnt || 0);
}

/** Domains with no trademark hits (mirrors GET /domains/no-hits). */
export async function listDomainsWithoutHits(userId: number, opts: ListOpts = {}) {
  const { limit, page, offset } = normPage(opts);
  const sortBy = safeSort(opts.sortBy, DOMAIN_SORT, "domain_name");
  const orderBy = safeOrder(opts.orderBy);
  const filterBy = safeSort(opts.filterBy, DOMAIN_FILTER, "domain_name");
  const search = opts.filter;

  const where = search
    ? `WHERE user_id = ? AND no_of_items = 0 AND ${filterBy} LIKE ?`
    : "WHERE user_id = ? AND no_of_items = 0";
  const params = search ? [userId, `%${search}%`] : [userId];

  const rows = await query(
    `SELECT * FROM domains ${where} ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  const cnt = await queryOne<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM domains ${where}`, params);
  return paginate(rows, page, limit, cnt?.cnt || 0);
}

/** Trademark items for a domain the user owns (mirrors GET /domains/items/:id). */
export async function listDomainItems(userId: number, domainId: number, opts: ListOpts = {}) {
  const { limit, page, offset } = normPage(opts);
  const sortBy = safeSort(opts.sortBy, ITEM_SORT, "domain_id");
  const orderBy = safeOrder(opts.orderBy);
  const filterBy = safeSort(opts.filterBy, ITEM_FILTER, "keyword");
  const search = opts.filter;

  const where = search
    ? `WHERE di.domain_id = ? AND d.user_id = ? AND di.${filterBy} LIKE ?`
    : "WHERE di.domain_id = ? AND d.user_id = ?";
  const params = search ? [domainId, userId, `%${search}%`] : [domainId, userId];

  const rows = await query<Record<string, unknown>>(
    `SELECT di.*, d.domain_name, d.user_id, d.status as domain_status
     FROM domain_items di LEFT JOIN domains d ON d.id = di.domain_id
     ${where} ORDER BY di.${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  const cnt = await queryOne<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM domain_items di LEFT JOIN domains d ON d.id = di.domain_id ${where}`,
    params,
  );

  // Nest the joined domain columns so rows match the admin's `items` type
  // (item.domain.domain_name), the same shape the Eloquent relation produced.
  const data = rows.map((r) => ({
    ...r,
    domain: {
      id: r.domain_id,
      domain_name: r.domain_name,
      user_id: r.user_id,
      status: r.domain_status,
    },
  }));
  return paginate(data, page, limit, cnt?.cnt || 0);
}

/**
 * Full report for one domain: the domain row, every stored mark (with its
 * primary owner inlined), the headline summary, and the derived risk level.
 * Returns null when the domain doesn't exist or isn't owned by the user.
 */
export async function getDomainReport(userId: number, domainId: number): Promise<DomainReport | null> {
  const domain = await queryOne<{
    id: number;
    domain_name: string;
    no_of_items: number | null;
    date_last_crawled: string | null;
    updated_at: string | null;
  }>(
    `SELECT id, domain_name, no_of_items, date_last_crawled, updated_at
     FROM domains WHERE id = ? AND user_id = ? LIMIT 1`,
    [domainId, userId],
  );
  if (!domain) return null;

  const rows = await query<Record<string, unknown>>(
    `SELECT di.id, di.keyword, di.registration_number, di.serial_number,
            di.status_label, di.status_definition, di.status_date, di.filing_date,
            di.registration_date, di.abandonment_date, di.expiration_date, di.description,
            (SELECT o.name FROM domains_items_owners o
              WHERE o.item_id = di.id AND o.name IS NOT NULL AND o.name <> ''
              ORDER BY o.id LIMIT 1) AS owner_name
     FROM domain_items di
     WHERE di.domain_id = ?
     ORDER BY (di.status_label LIKE '%regist%') DESC, di.id DESC`,
    [domainId],
  );

  const items: ReportItem[] = rows.map((r) => ({
    id: Number(r.id),
    keyword: (r.keyword as string) ?? "",
    registration_number: (r.registration_number as string) ?? null,
    serial_number: (r.serial_number as string) ?? null,
    status_label: (r.status_label as string) ?? null,
    status_definition: (r.status_definition as string) ?? null,
    status_date: (r.status_date as string) ?? null,
    filing_date: (r.filing_date as string) ?? null,
    registration_date: (r.registration_date as string) ?? null,
    abandonment_date: (r.abandonment_date as string) ?? null,
    expiration_date: (r.expiration_date as string) ?? null,
    description: (r.description as string) ?? null,
    owner_name: (r.owner_name as string) ?? null,
  }));

  return {
    domain: {
      id: domain.id,
      domain_name: domain.domain_name,
      no_of_items: domain.no_of_items,
      last_scanned_at: domain.date_last_crawled || domain.updated_at || null,
    },
    items,
    summary: summarize(items, domain.domain_name),
    risk_level: computeRisk(items, domain.domain_name),
  };
}

/** Dashboard counters (mirrors GET /domains/stats). One round-trip, parallel. */
export async function getDomainStats(userId: number) {
  const [counts, atRisk] = await Promise.all([
    queryOne<{ total: number; hits: number; noHits: number; investor: number }>(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN no_of_items > 0 THEN 1 ELSE 0 END) AS hits,
         SUM(CASE WHEN no_of_items = 0 THEN 1 ELSE 0 END) AS noHits,
         SUM(CASE WHEN is_cron = 1 THEN 1 ELSE 0 END) AS investor
       FROM domains WHERE user_id = ?`,
      [userId],
    ),
    queryOne<{ cnt: number }>(
      `SELECT COUNT(DISTINCT d.id) as cnt FROM domains d
       INNER JOIN domain_items di ON di.domain_id = d.id
       WHERE d.user_id = ? AND di.status_label LIKE '%pending%'
       AND di.registration_number = '0000000' AND di.status_definition LIKE '%NEW%'`,
      [userId],
    ),
  ]);

  return {
    domainsCount: Number(counts?.total) || 0,
    hitsCount: Number(counts?.hits) || 0,
    noHitsCount: Number(counts?.noHits) || 0,
    domainsAtRiskCount: Number(atRisk?.cnt) || 0,
    investorSpaceCount: Number(counts?.investor) || 0,
  };
}

/** Monthly hit history for the dashboard chart (mirrors GET /domains/historical-hits). */
export async function getHistoricalHits(userId: number) {
  return query(
    `SELECT COUNT(*) as my_y,
            SUBSTRING(DATE_FORMAT(di.updated_at, '%M'), 1, 3) as my_month,
            YEAR(di.updated_at) as the_year,
            CONCAT(SUBSTRING(DATE_FORMAT(di.updated_at, '%M'), 1, 3), ' ', YEAR(di.updated_at)) as my_x
     FROM domain_items di
     INNER JOIN domains d ON d.id = di.domain_id
     WHERE d.user_id = ?
     GROUP BY the_year, my_month, my_x`,
    [userId],
  );
}

/** A user's invoices (mirrors GET /invoices). */
export async function listInvoices(userId: number, opts: ListOpts = {}) {
  const { limit, page, offset } = normPage(opts);
  const sortBy = safeSort(opts.sortBy, INVOICE_SORT, "id");
  const orderBy = safeOrder(opts.orderBy);

  const rows = await query(
    `SELECT * FROM invoices WHERE user_id = ? ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
    [userId, limit, offset],
  );
  const cnt = await queryOne<{ cnt: number }>(
    "SELECT COUNT(*) as cnt FROM invoices WHERE user_id = ?", [userId],
  );
  return paginate(rows, page, limit, cnt?.cnt || 0);
}

/** A single user's full row (mirrors GET /user/:id). */
export async function getUserById(userId: number) {
  return queryOne("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Domain monitoring (derived scan_status / risk_level — see lib/monitor-status)
 * ────────────────────────────────────────────────────────────────────────── */

interface MonitorRow {
  id: number;
  domain_name: string;
  no_of_items: number | null;
  date_last_crawled: string | null;
  updated_at: string | null;
  item_count: number;
  registered_count: number;
  top_owner: string | null;
}

/**
 * Derive the UI-facing monitor shape from a raw DB row.
 *  - scan_status: no_of_items IS NULL  →  freshly added, not yet scanned.
 *  - risk_level:  0 marks → clear · has registered/live mark → action · else review.
 *  - last_scanned_at: date_last_crawled, falling back to updated_at.
 * TODO(api): drop this once the DB exposes real scan_status/risk_level columns.
 */
function deriveMonitor(r: MonitorRow): MonitorDomain {
  const scanning = r.no_of_items == null;
  const itemCount = Number(r.item_count) || 0;
  const registered = Number(r.registered_count) || 0;
  return {
    id: Number(r.id),
    domain_name: r.domain_name,
    no_of_items: scanning ? null : Number(r.no_of_items),
    scan_status: scanning ? "scanning" : "scanned",
    risk_level: scanning ? null : itemCount === 0 ? "clear" : registered > 0 ? "action" : "review",
    last_scanned_at: r.date_last_crawled || r.updated_at || null,
    top_owner: r.top_owner || null,
  };
}

const MONITOR_SELECT = `
  SELECT d.id, d.domain_name, d.no_of_items, d.date_last_crawled, d.updated_at,
    (SELECT COUNT(*) FROM domain_items di WHERE di.domain_id = d.id) AS item_count,
    (SELECT COUNT(*) FROM domain_items di WHERE di.domain_id = d.id
       AND di.registration_number IS NOT NULL AND di.registration_number <> ''
       AND di.registration_number <> '0000000') AS registered_count,
    (SELECT dio.name FROM domains_items_owners dio
       JOIN domain_items di2 ON di2.id = dio.item_id
       WHERE di2.domain_id = d.id AND dio.name IS NOT NULL AND dio.name <> ''
       ORDER BY di2.id LIMIT 1) AS top_owner
  FROM domains d`;

/** All of a user's monitored domains, newest first. */
export async function listMonitorDomains(userId: number, limit = 200): Promise<MonitorDomain[]> {
  const rows = await query<MonitorRow>(
    `${MONITOR_SELECT} WHERE d.user_id = ? ORDER BY d.created_at DESC LIMIT ?`,
    [userId, limit],
  );
  return rows.map(deriveMonitor);
}

/** Current status for a specific set of domain ids (poll endpoint). */
export async function getMonitorStatuses(userId: number, ids: number[]): Promise<MonitorStatus[]> {
  const clean = (ids || []).map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0);
  if (!clean.length) return [];
  const placeholders = clean.map(() => "?").join(",");
  const rows = await query<MonitorRow>(
    `${MONITOR_SELECT} WHERE d.user_id = ? AND d.id IN (${placeholders})`,
    [userId, ...clean],
  );
  return rows.map(deriveMonitor).map((d) => ({
    id: d.id,
    scan_status: d.scan_status,
    risk_level: d.risk_level,
    no_of_items: d.no_of_items,
    last_scanned_at: d.last_scanned_at,
    top_owner: d.top_owner,
  }));
}

/** Metric-card counts for the monitoring summary row. */
export async function getMonitorSummary(userId: number): Promise<MonitorSummary> {
  const row = await queryOne<{ monitored: number; scanning: number; needReview: number; clear: number }>(
    `SELECT
       COUNT(*) AS monitored,
       SUM(CASE WHEN no_of_items IS NULL THEN 1 ELSE 0 END) AS scanning,
       SUM(CASE WHEN no_of_items > 0 THEN 1 ELSE 0 END) AS needReview,
       SUM(CASE WHEN no_of_items = 0 THEN 1 ELSE 0 END) AS clear
     FROM domains WHERE user_id = ?`,
    [userId],
  );
  return {
    monitored: Number(row?.monitored) || 0,
    scanning: Number(row?.scanning) || 0,
    needReview: Number(row?.needReview) || 0,
    clear: Number(row?.clear) || 0,
  };
}

/** Lowercase + strip protocol/www/path so "https://WWW.Foo.com/x" → "foo.com". */
function normalizeDomainName(raw: string): string {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .trim();
}

const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/** The user's plan/package joined with their current domain usage. */
export async function getUserPlan(userId: number): Promise<UserPlan> {
  const row = await queryOne<{
    package_id: number | null;
    name: string | null;
    start_limit: number | null;
    end_limit: number | null;
    price: string | number | null;
    used: number;
  }>(
    `SELECT u.package_id, p.name, p.start_limit, p.end_limit, p.price,
       (SELECT COUNT(*) FROM domains WHERE user_id = u.id) AS used
     FROM users u LEFT JOIN packages p ON p.id = u.package_id
     WHERE u.id = ? LIMIT 1`,
    [userId],
  );

  const end_limit = row?.end_limit == null ? null : Number(row.end_limit);
  const start_limit = row?.start_limit == null ? null : Number(row.start_limit);
  const price = row?.price == null ? null : Number(row.price);
  const used = Number(row?.used) || 0;
  const remaining = end_limit == null ? null : Math.max(0, end_limit - used);

  return {
    package_id: row?.package_id == null ? null : Number(row.package_id),
    name: row?.name ?? null,
    start_limit,
    end_limit,
    price,
    used,
    remaining,
    isFree: price == null || price === 0,
    limitReached: end_limit != null && used >= end_limit,
  };
}

export interface MonitorAddResult {
  created: MonitorDomain[];
  skipped: string[];
  message: string;
  /** True when the plan limit blocked one or more domains. */
  limitReached: boolean;
  /** Plan limit (null = unlimited) and usage after this add, for the upgrade CTA. */
  planLimit: number | null;
  planUsed: number;
}

/**
 * Insert new domains for a user (direct DB). Normalizes + dedupes against the
 * user's existing domains and within the batch. New rows are inserted with
 * no_of_items NULL so the UI renders them as "scanning" until a scan runs.
 *
 * Enforces the plan limit (packages.end_limit) the same way the legacy
 * DomainController did: domains beyond `end_limit - currentCount` are rejected
 * and reported so the UI can show an upgrade CTA.
 */
export async function insertMonitorDomains(userId: number, names: string[]): Promise<MonitorAddResult> {
  const skipped: string[] = [];
  const seen = new Set<string>();
  const valid: string[] = [];

  for (const raw of names || []) {
    const name = normalizeDomainName(raw);
    if (!name) continue;
    if (!DOMAIN_RE.test(name)) {
      skipped.push(`${raw.trim()} (invalid)`);
      continue;
    }
    if (seen.has(name)) continue;
    seen.add(name);
    valid.push(name);
  }

  // Plan limit + current usage.
  const plan = await getUserPlan(userId);
  const endLimit = plan.end_limit;
  let used = plan.used;
  let allowed = endLimit == null ? Number.POSITIVE_INFINITY : Math.max(0, endLimit - used);

  if (!valid.length) {
    return {
      created: [],
      skipped,
      message: "No valid domains to add.",
      limitReached: false,
      planLimit: endLimit,
      planUsed: used,
    };
  }

  const placeholders = valid.map(() => "?").join(",");
  const existingRows = await query<{ domain_name: string }>(
    `SELECT domain_name FROM domains WHERE user_id = ? AND domain_name IN (${placeholders})`,
    [userId, ...valid],
  );
  const existing = new Set(existingRows.map((r) => r.domain_name));

  const created: MonitorDomain[] = [];
  let limitReached = false;
  for (const name of valid) {
    if (existing.has(name)) {
      skipped.push(`${name} (already monitored)`);
      continue;
    }
    if (created.length >= allowed) {
      limitReached = true;
      skipped.push(`${name} (plan limit reached)`);
      continue;
    }
    const res = await execute(
      `INSERT INTO domains (user_id, domain_name, no_of_items, is_cron, created_at, updated_at)
       VALUES (?, ?, NULL, 0, NOW(), NOW())`,
      [userId, name],
    );
    created.push({
      id: res.insertId,
      domain_name: name,
      no_of_items: null,
      scan_status: "scanning",
      risk_level: null,
      last_scanned_at: null,
      top_owner: null,
    });
  }

  used += created.length;

  const parts = [`${created.length} domain${created.length === 1 ? "" : "s"} added`];
  if (limitReached) {
    parts.push("plan limit reached \u2014 upgrade for more");
  } else if (skipped.length) {
    parts.push(`${skipped.length} skipped`);
  }

  return {
    created,
    skipped,
    message: parts.join(" \u00b7 "),
    limitReached,
    planLimit: endLimit,
    planUsed: used,
  };
}

/** Delete the given domain ids that belong to the user (mirrors DELETE /domains/delete). */
export async function deleteDomains(userId: number, ids: number[]) {
  const clean = (ids || []).map((n) => Number(n)).filter((n) => Number.isFinite(n));
  if (!clean.length) return { success: false };
  const placeholders = clean.map(() => "?").join(",");
  await execute(`DELETE FROM domains WHERE id IN (${placeholders}) AND user_id = ?`, [...clean, userId]);
  return { success: true };
}
