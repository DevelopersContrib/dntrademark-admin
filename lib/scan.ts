/**
 * Trademark scan: turn a domain into a keyword, query the USPTO API, and
 * persist matches into `domain_items` (+ `domains_items_owners`), then update
 * `domains.no_of_items`.
 *
 * Incremental + idempotent: only serial numbers not already stored for the
 * domain are inserted, so re-scanning never duplicates rows or orphans the
 * letter-of-protest records linked to existing items.
 */

import { execute, query, queryOne } from "./db";
import { isUsptoConfigured, trademarkSearch, type UsptoItem, type UsptoOwner } from "./uspto";

/** Derive the search keyword from a domain name: strip TLD + lowercase. */
export function keywordFromDomain(domainName: string): string {
  const bare = domainName.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  const firstLabel = bare.split(".")[0];
  return firstLabel || bare;
}

/** Normalize a USPTO date-ish value to "YYYY-MM-DD" or null for MySQL DATE columns. */
function toDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  const m = v.match(/^\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
}

function str(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

export interface ScanResult {
  domainId: number;
  keyword: string;
  found: number;
  inserted: number;
  totalItems: number;
  skipped?: string;
}

/**
 * Scan a single domain. Safe to call repeatedly. Never throws — returns a
 * structured result describing what happened.
 */
export async function scanDomain(domainId: number, domainName: string): Promise<ScanResult> {
  const keyword = keywordFromDomain(domainName);

  if (!isUsptoConfigured()) {
    return { domainId, keyword, found: 0, inserted: 0, totalItems: 0, skipped: "uspto_not_configured" };
  }

  let items: UsptoItem[] = [];
  try {
    items = await trademarkSearch(keyword, "active");
  } catch {
    return { domainId, keyword, found: 0, inserted: 0, totalItems: 0, skipped: "search_failed" };
  }

  // Existing serials for this domain (avoid duplicates / preserve protest links).
  const existingRows = await query<{ serial_number: string | null }>(
    "SELECT serial_number FROM domain_items WHERE domain_id = ?",
    [domainId],
  );
  const existing = new Set(
    existingRows.map((r) => (r.serial_number ? String(r.serial_number) : "")).filter(Boolean),
  );

  let inserted = 0;
  for (const item of items) {
    const serial = str(item.serial_number);
    if (!serial || existing.has(serial)) continue;

    const result = await execute(
      `INSERT INTO domain_items
        (domain_id, keyword, registration_number, serial_number, status_label,
         status_date, status_definition, filing_date, registration_date,
         abandonment_date, expiration_date, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        domainId,
        str(item.keyword) ?? keyword,
        str(item.registration_number),
        serial,
        str(item.status_label),
        toDate(item.status_date),
        str(item.status_definition),
        toDate(item.filing_date),
        toDate(item.registration_date),
        toDate(item.abandonment_date),
        toDate(item.expiration_date),
        str(item.description),
      ],
    );

    const itemId = result.insertId;
    const owners: UsptoOwner[] = Array.isArray(item.owners) ? item.owners : [];
    for (const owner of owners) {
      await execute(
        `INSERT INTO domains_items_owners
          (item_id, keyword, owner_label, legal_entity_type, name, address1,
           city, state, country, postcode, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          itemId,
          str(item.keyword) ?? keyword,
          str(owner.owner_label),
          str(owner.legal_entity_type),
          str(owner.name),
          str(owner.address1),
          str(owner.city),
          str(owner.state),
          str(owner.country),
          str(owner.postcode),
        ],
      );
    }

    existing.add(serial);
    inserted += 1;
  }

  // Recompute total hit count for the domain.
  const countRow = await queryOne<{ cnt: number }>(
    "SELECT COUNT(*) as cnt FROM domain_items WHERE domain_id = ?",
    [domainId],
  );
  const totalItems = countRow?.cnt ?? 0;

  // Stamp date_last_crawled too: a non-null no_of_items + crawl date is how the
  // monitoring UI tells "scanned" apart from a freshly-added "scanning" row.
  await execute(
    "UPDATE domains SET no_of_items = ?, date_last_crawled = NOW(), updated_at = NOW() WHERE id = ?",
    [totalItems, domainId],
  );

  return { domainId, keyword, found: items.length, inserted, totalItems };
}
