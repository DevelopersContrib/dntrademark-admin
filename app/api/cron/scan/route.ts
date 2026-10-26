export const dynamic = "force-dynamic";
export const maxDuration = 300;

import { readQuery } from "@/lib/db";
import { scanDomain, type ScanResult } from "@/lib/scan";
import { isUsptoConfigured } from "@/lib/uspto";

const BATCH_BUDGET_MS = 250_000;
const STALE_HOURS = 23;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function verifyCronSecret(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

interface StaleDomain {
  id: number;
  domain_name: string;
}

export async function GET(req: Request) {
  const start = Date.now();

  if (!verifyCronSecret(req)) {
    return json({ error: "Unauthorized" }, 401);
  }

  if (!isUsptoConfigured()) {
    console.log("[cron/scan] USPTO not configured — skipping");
    return json({ skipped: "uspto_not_configured", scanned: 0 });
  }

  const domains = await readQuery<StaleDomain>(
    `SELECT id, domain_name FROM domains
     WHERE date_last_crawled IS NULL
        OR date_last_crawled < DATE_SUB(NOW(), INTERVAL ${STALE_HOURS} HOUR)
     ORDER BY date_last_crawled IS NULL DESC,
              date_last_crawled ASC
     LIMIT 500`,
  );

  console.log(`[cron/scan] ${domains.length} stale domains queued`);

  const results: ScanResult[] = [];
  let errors = 0;

  for (const d of domains) {
    if (Date.now() - start > BATCH_BUDGET_MS) {
      console.log(`[cron/scan] time budget hit after ${results.length} domains`);
      break;
    }

    try {
      const r = await scanDomain(d.id, d.domain_name);
      results.push(r);

      if (r.skipped) {
        console.log(`[cron/scan] ${d.domain_name}: skipped (${r.skipped})`);
      } else {
        console.log(
          `[cron/scan] ${d.domain_name}: found=${r.found} inserted=${r.inserted} total=${r.totalItems}`,
        );
      }
    } catch (err) {
      errors += 1;
      console.error(`[cron/scan] ${d.domain_name}: error`, err);
    }
  }

  const elapsed = Date.now() - start;
  const summary = {
    scanned: results.length,
    queued: domains.length,
    inserted: results.reduce((s, r) => s + r.inserted, 0),
    errors,
    elapsedMs: elapsed,
  };

  console.log("[cron/scan] done", JSON.stringify(summary));
  return json(summary);
}
