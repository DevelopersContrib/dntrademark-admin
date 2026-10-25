/**
 * Background scan kick — fire-and-forget wrapper around scanDomain that
 * survives Vercel serverless via waitUntil.  Imported by route handlers
 * that insert new domains so every add gets a scan without relying on
 * the client staying open.
 */
import { waitUntil } from "@vercel/functions";
import { scanDomain } from "./scan";

interface ScanTarget {
  id: number;
  domain_name: string;
}

/**
 * Kick scans for the given domains in the background.  Returns immediately;
 * the actual work continues after the HTTP response is sent (Vercel
 * `waitUntil`).  In local dev the promise simply runs untracked — the
 * Node process stays alive anyway.
 */
export function kickScans(domains: ScanTarget[]): void {
  if (!domains.length) return;

  const work = (async () => {
    for (const d of domains) {
      try {
        await scanDomain(d.id, d.domain_name);
      } catch (err) {
        console.error(`[scan-kick] domain ${d.id} (${d.domain_name}):`, err);
      }
    }
  })();

  try {
    waitUntil(work);
  } catch {
    work.catch((err) => console.error("[scan-kick] background error:", err));
  }
}
