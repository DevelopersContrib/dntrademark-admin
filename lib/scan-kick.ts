/**
 * Background scan kick — fire-and-forget wrapper around scanDomain that
 * survives Vercel serverless via the platform's waitUntil hook.  Imported
 * by route handlers that insert new domains so every add gets a scan
 * without relying on the client staying open.
 *
 * We access the Vercel request-context symbol directly instead of pulling
 * in `@vercel/functions` (whose barrel export drags in a `ws` dependency
 * that breaks the Next 13 webpack build).
 */
import { scanDomain } from "./scan";

interface ScanTarget {
  id: number;
  domain_name: string;
}

type WaitUntilFn = (p: Promise<unknown>) => void;

function getWaitUntil(): WaitUntilFn | undefined {
  const ctx = (globalThis as Record<symbol, { get?: () => { waitUntil?: WaitUntilFn } }>)[
    Symbol.for("@vercel/request-context")
  ];
  return ctx?.get?.()?.waitUntil;
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

  const wu = getWaitUntil();
  if (wu) {
    wu(work);
  } else {
    work.catch((err) => console.error("[scan-kick] background error:", err));
  }
}
