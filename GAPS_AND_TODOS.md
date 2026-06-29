# DNTrademark Admin — Gaps & TODOs (scope)

_Current-state audit as of 2026-06-29. Companion to `DEVELOPER_GUIDE.md` (how it
works) and `todo.md` (the older deploy handoff). Items are grouped by theme and
tagged **P0** (blocking/broken) → **P3** (nice to have)._

Legend: 📁 file · 💥 impact · 🔧 fix

---

## A. Scanning & data freshness (the biggest functional gaps)

### 1. New domains are never auto-scanned in this app — **P0**
- 📁 `app/api/domain/monitor-add/route.tsx` → `insertMonitorDomains` (`lib/db-queries.ts`)
- New rows are inserted with `no_of_items = NULL` ("scanning") but **`scanDomain()` is never called**. The only thing that runs a scan is the manual **Rescan** button (`/api/domain/scan`).
- 💥 A domain added via the monitoring flow stays "Scanning USPTO…" **forever** unless (a) the user clicks Rescan, or (b) the sibling `api-dntrademark` cron scans the shared DB. If that cron isn't deployed/running, domains never resolve.
- 🔧 Fire a scan after insert. Either `await scanDomain()` inline (slower add, simplest), or kick it off in the background, or add a Vercel Cron (see #3).

### 2. Two divergent "add domain" paths — **P1**
- 📁 `app/api/domain/add/route.tsx` (🌐 proxies Laravel `/domains/add`, Bearer token) **vs** `app/api/domain/monitor-add/route.tsx` (✅ direct DB).
- 💥 Two code paths with different behavior: plan-limit enforcement + normalization/dedupe only exist on the **direct-DB** path; the legacy path relies on Laravel. Confusing and easy to regress.
- 🔧 Pick one. Migrate `/domains/add` to `insertMonitorDomains` (then optionally scan), or retire the monitor-add path. Make the `/domains/add` page use the chosen one.

### 3. No scheduled re-scan / automation in this repo — **P1**
- 📁 no `vercel.json`, no cron, no workers in `dntrademark-admin`.
- 💥 Hit counts, statuses, and "next scan in 24h" (shown in the report trust line) are **not actually driven by anything in this app**. The copy implies a daily scan that this repo doesn't perform.
- 🔧 Either add a Vercel Cron route here (e.g. `/api/cron/scan` that scans stale/`NULL` domains, protected by a secret) **or** confirm the `api-dntrademark` daily cron is deployed and owns this, and soften the UI copy if not.

### 4. Derived `scan_status` / `risk_level` (no real columns) — **P2**
- 📁 `lib/db-queries.ts` (`deriveMonitor`), `lib/monitor-status.ts` — both carry `TODO(api)`.
- 💥 Status is inferred from `no_of_items` + registered-count heuristics, not a source of truth. A failed scan looks identical to "clear" (0 items). There is **no `failed` state persisted** even though the UI supports it.
- 🔧 Add real `scan_status` / `risk_level` / `last_scanned_at` columns (and record failures in `scanDomain`), then drop the derivation.

---

## B. Dead / stubbed endpoints

### 5. `/api/domain/stats` returns empty string — **P2**
- 📁 `app/api/domain/stats/route.tsx` — body is commented out, returns `''`.
- 💥 Dead route. Real stats come from the server component via `getDomainStats`. Anything still calling this gets nothing.
- 🔧 Delete the route, or wire it to `getDomainStats(userId)` with a 401 guard.

### 6. `/api/user/get` returns `{result:null}` — **P2**
- 📁 `app/api/user/get/route.tsx` — fully commented out.
- 🔧 Delete or implement via `getUserById`.

---

## C. Security & secrets

### 7. Hardcoded API key + URL in `getNotification` — **P1**
- 📁 `lib/data.tsx` (`getNotification`) — `api_key=6334aed4...` and `https://api.dntrademark.com/...` are inline string literals.
- 💥 Secret committed to source; can't rotate via env.
- 🔧 Use `process.env.API_URL` / `process.env.API_KEY` like the other helpers. **Rotate the key** since it's been in git.

### 8. No rate-limit / abuse guard on email + scan — **P2**
- 📁 `app/api/domain/report-email/route.tsx`, `app/api/domain/scan/route.tsx`
- 💥 An authenticated user can hammer "Email me" (SES cost / spam) or "Rescan" (burns USPTO RapidAPI credits) with no throttle.
- 🔧 Add a simple per-user cooldown (e.g. last_sent timestamp, or in-memory/redis limiter). USPTO credits are finite — rescan especially.

### 9. Unauthenticated-access review for legacy routes — **P2**
- 📁 `app/api/domain/add`, several `app/api/user/*`, `app/api/item/protest/*`
- 💥 Direct-DB routes correctly 401 on no session; some legacy proxy routes accept a client-supplied `token` and forward it without a session check.
- 🔧 Add `getSessionUserId()` / session guards consistently; never trust a client-passed bearer token.

---

## D. Legacy API still in the critical path

These still depend on `https://api.dntrademark.com` (the Laravel backend not in this workspace). If that API is being retired, each is a migration task. 📁 see `DEVELOPER_GUIDE.md` §7b.

| Feature | Routes / helpers | Migrate to |
| --- | --- | --- |
| Auth (login/signup/check) | `auth/signin`, `auth/signup`, `user/check`, `user/email-available` | Direct DB + bcrypt (`bcryptjs` already installed) — **P1** if Laravel is going away |
| User CRUD | `user/get`, `user/update`, `user/delete` | `getUserById` + new update/delete in `db-queries` — **P2** |
| Protest letters | `item/protest*`, `domains/items/protests/save`, `getItem`, `getItemProtestList` | New `db-queries` for `item_protests` table — **P2** |
| Invoices detail / packages | `invoices`, `getInvoiceDetails`, `getPackages` | Direct DB (`invoices`, `packages`) — **P2** |
| Notifications | `notifications`, `notifications/[id]` | Direct DB + polling — **P2** |
| Payments | `charge`, `chargeinvoice` | Keep Stripe, but see #10 |

### 10. No Stripe webhook — **P1**
- 📁 payments go `POST /api/charge` → Laravel `/payment/charge`. No `payment_intent.*` / subscription webhook exists in this app.
- 💥 Async/failed payments and renewals may not reconcile if the user closes the tab; `users.package_id` can drift from Stripe reality.
- 🔧 Add a Stripe webhook (here or on the API) for `payment_intent.succeeded`, `invoice.paid`, subscription lifecycle.

---

## E. Real-time / UX

### 11. Notifications never refresh — **P2**
- 📁 `components/Header/DropdownNotification.tsx` (fetch once on mount).
- 💥 Users don't see new trademark hits until a full reload.
- 🔧 Poll every ~60s while open, or SSE/push from the API.

### 12. `/messages` dead links (404) — **P2**
- 📁 `components/Header/DropdownMessage.tsx` (5 links to `/messages`; no such route).
- 🔧 Remove the dropdown, or build the route.

### 13. Report PDF rendering risk — **P2**
- 📁 `components/Domains/DomainReport.tsx` (`react-to-pdf` → `html2canvas` + `jspdf`).
- 💥 `html2canvas` can mis-render modern CSS color/opacity (`bg-x/10`) and is heavy. Badges/banner backgrounds may drop in the PDF; large reports can be slow.
- 🔧 Verify output; if colors break, fall back to a print stylesheet (`window.print()` + `@media print`) or server-rendered PDF.

---

## F. Cleanup / tech debt

### 14. Orphaned report component — **P3**
- 📁 `components/Domains/WithItems.tsx` is no longer used (replaced by `DomainReport`). The `/api/domain/items` route + `getDomainItems` helper are still referenced by it only.
- 🔧 Delete `WithItems.tsx` (and the route/helper if nothing else uses them).

### 15. Template demo routes still shipped — **P3**
- 📁 `app/(dashboard)/{calendar,chart,tables,ui/*,forms/*,settings2}/page.tsx`
- 🔧 Delete unused TailAdmin demo pages + remove from middleware matcher.

### 16. Duplicate signup routes — **P3**
- 📁 `app/auth/register/page.tsx` vs `app/auth/signup/page.tsx`.
- 🔧 Consolidate to one.

### 17. Inconsistent error handling + debug logs — **P3**
- 📁 `lib/data.tsx`, `lib/options.tsx`, domain components.
- 💥 Helpers variously return `null` / `undefined` / `'Unauthenticated.'`; many `console.log` in prod paths.
- 🔧 Standardize return contract; strip debug logs.

---

## G. Quality, deps, infra

### 18. No tests, no CI — **P2**
- 💥 No unit/E2E tests; nothing runs lint/build on push.
- 🔧 Add an authenticated smoke test (login → visit each sidebar route) + a GitHub Action running `pnpm build` + `pnpm lint`. Unit-test the pure modules first (`lib/report.ts`, `lib/plan.ts`, `lib/monitor-status.ts`) — they're side-effect-free and high value.

### 19. Dependency vulnerabilities — **P2**
- 📁 `todo.md` noted 36 vulns (3 critical, 14 high). 
- 🔧 Run `pnpm audit` / `pnpm audit --fix`; re-check after the Next upgrade.

### 20. Framework upgrade — **P2 (plan, don't rush)**
- Currently Next.js 13.5.11 / React 18 / NextAuth v4. Staged path: 13→14, then 14→15, then NextAuth v4→Auth.js v5 separately. Fix auth/API gaps first.

### 21. Connection-pool sizing & serverless — **P3**
- 📁 `lib/db.ts` (pool limit 10, module singleton).
- 💥 On Vercel serverless, each cold instance opens its own pool; many instances × 10 can exceed RDS `max_connections`.
- 🔧 Lower per-instance limit, or use RDS Proxy / a serverless driver.

---

## Suggested order of attack

1. **#1 auto-scan on add** + **#3 cron** (or confirm the API cron) — makes the product actually work end-to-end.
2. **#7 hardcoded key** (rotate) + **#8 rate-limit rescan/email** — cost + security.
3. **#2 unify add paths**, **#5/#6 delete dead routes**, **#14 remove WithItems**.
4. **#10 Stripe webhook**, **#11 notification polling**.
5. **#18 tests/CI**, then the legacy-API migrations (§D) if Laravel is being sunset.
