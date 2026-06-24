/**
 * USPTO Trademark API client (RapidAPI — pentium10/uspto-trademark-api).
 *
 * Server-only. Powers the "Retest" / scan feature that populates `domain_items`
 * / `domains_items_owners`. The DB schema mirrors this API's response shape 1:1.
 *
 * Env (already present in the admin .env.local):
 *   RAPID_API_KEY  = <your RapidAPI key>
 *   RAPID_API_HOST = uspto-trademark.p.rapidapi.com   (default)
 */

const RAPIDAPI_KEY = process.env.RAPID_API_KEY || process.env.RAPIDAPI_KEY || "";
const RAPIDAPI_HOST =
  process.env.RAPID_API_HOST || process.env.RAPIDAPI_HOST || "uspto-trademark.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

/** Whether the USPTO integration is configured. When false, all calls return empty. */
export function isUsptoConfigured(): boolean {
  return RAPIDAPI_KEY.length > 0;
}

/** Owner block as returned by the USPTO API (maps to domains_items_owners). */
export interface UsptoOwner {
  name?: string | null;
  owner_label?: string | null;
  legal_entity_type?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postcode?: string | null;
}

/** Trademark item as returned by the USPTO API (maps to domain_items). */
export interface UsptoItem {
  keyword?: string | null;
  registration_number?: string | null;
  serial_number?: string | null;
  status_label?: string | null;
  status_code?: string | number | null;
  status_date?: string | null;
  status_definition?: string | null;
  filing_date?: string | null;
  registration_date?: string | null;
  abandonment_date?: string | null;
  expiration_date?: string | null;
  description?: string | null;
  owners?: UsptoOwner[] | null;
}

interface UsptoSearchResponse {
  count?: number;
  items?: UsptoItem[];
}

function headers(): Record<string, string> {
  return {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
    Accept: "application/json",
  };
}

/** Low-level GET with credit-header logging. Returns parsed JSON or null on error. */
async function get<T>(path: string): Promise<T | null> {
  if (!isUsptoConfigured()) return null;
  try {
    const res = await fetch(`${BASE_URL}${path}`, { headers: headers() });

    const remaining =
      res.headers.get("x-ratelimit-requests-remaining") ||
      res.headers.get("X-RapidAPI-Requests-remaining");
    if (remaining !== null) {
      console.log(`[uspto] ${path} -> ${res.status} | requests remaining: ${remaining}`);
    }

    if (!res.ok) {
      console.error(`[uspto] ${path} failed: ${res.status} ${res.statusText}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[uspto] ${path} error:`, err);
    return null;
  }
}

/**
 * Keyword search — primary tool for "is this name already trademarked?".
 * @param keyword the brand/name term (domain minus TLD)
 * @param status  "active" (live/registered only) or "all"
 */
export async function trademarkSearch(
  keyword: string,
  status: "active" | "all" = "active",
): Promise<UsptoItem[]> {
  const data = await get<UsptoSearchResponse>(
    `/v1/trademarkSearch/${encodeURIComponent(keyword)}/${status}`,
  );
  return data?.items ?? [];
}

/** Full 30+ field detail for a single 8-digit serial number. */
export async function serialSearch(serialNumber: string): Promise<UsptoItem | null> {
  const data = await get<UsptoSearchResponse>(
    `/v1/serialSearch/${encodeURIComponent(serialNumber)}`,
  );
  return data?.items?.[0] ?? null;
}
