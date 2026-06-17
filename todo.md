# DNTrademark Admin — TODO

Handoff notes for next week (Kareen / team). Items are ordered by priority.

---

## P0 — Deploy & verify production

- [ ] **Deploy latest route/auth fixes to Vercel** and smoke-test while logged in:
  - `/domains/all`, `/domains/with-hits`, `/domains/without-hits`
  - `/domains/add`, `/billing`, `/settings`, `/notifications`, `/feedback`
- [ ] **Confirm Vercel env vars** are set: `NEXTAUTH_URL=https://dash.dntrademark.com`, `NEXTAUTH_SECRET`, `API_URL`, `API_KEY`, OAuth keys, Stripe keys
- [ ] **Set Vercel package manager to pnpm** (see tooling section below) and confirm build succeeds on deploy

---

## P1 — Auth & broken features

- [ ] **Fix GitHub + Google OAuth on production** — smoke test showed `error=github` / `error=google`; verify callback URLs are registered:
  - `https://dash.dntrademark.com/api/auth/callback/github`
  - `https://dash.dntrademark.com/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/{github|google}` for local dev
- [ ] **Remove or fix `/messages` dead links** — header dropdown links to `/messages` but no route exists (404)
- [ ] **Harden unauthenticated API routes** — these return 200 without a session (should return 401):
  - `/api/domain/stats`
  - `/api/user/get`

---

## P1 — Code quality & security

- [ ] **Remove hardcoded API key** in `lib/data.tsx` (`getNotification`) — use `process.env.API_KEY` like other helpers
- [ ] **Run `npm audit fix`** (or `pnpm audit`) — 36 vulnerabilities (3 critical, 14 high) as of last check
- [ ] **Review `Unauthenticated` component** (`components/Unauthenticated.tsx`) — it auto-signs-out after 800ms; confirm this is intended UX

---

## P2 — Tooling alignment

- [ ] **Pick one package manager** — `package.json` declares `pnpm@9.15.4` but `package-lock.json` exists and no `pnpm-lock.yaml`:
  ```bash
  pnpm install          # creates pnpm-lock.yaml
  rm package-lock.json  # if committing to pnpm
  ```
- [ ] **Update browserslist DB**: `npx update-browserslist-db@latest`

---

## P2 — Framework upgrade (plan, don't rush)

Current stack: **Next.js 13.4.12**, React 18, NextAuth v4.

Recommended staged path:

1. **13 → 14** first (App Router stable, fewer breaking changes)
2. Then **14 → 15** after production is stable
3. **NextAuth v4 → Auth.js v5** is a separate migration — defer until Next.js is current

Before upgrading:

- [ ] Ensure all routes pass smoke tests when authenticated
- [ ] Fix OAuth and API auth gaps first
- [ ] Read Next.js migration guides for each major version

---

## P2 — Cleanup / tech debt

- [ ] **Template demo routes** still in the app (`/calendar`, `/chart`, `/tables`, `/forms/*`, `/ui/*`, `/settings2`) — remove from sidebar/middleware or delete if unused
- [ ] **`/auth/register` vs `/auth/signup`** — two signup routes; consolidate if redundant
- [ ] **Consistent API error handling** in `lib/data.tsx` — some helpers return `'Unauthenticated.'`, others return `undefined` or only `console.log` on failure
- [ ] **JWT callback** in `lib/options.tsx` — only sets `token` when `account` is present; verify token persists correctly across session refresh for all providers

---

## P3 — Nice to have

- [ ] Add authenticated E2E smoke test script (login → visit all sidebar routes)
- [ ] Remove `console.log` debug statements in production paths (`lib/data.tsx`, `lib/options.tsx`, domain components)
- [ ] Consider removing template pages from middleware matcher once deleted

---

## Done recently (for context)

- Split server/client auth modules (`lib/auth-api.ts`, `lib/client-api.ts`)
- Fixed sign-in webpack crash and dashboard `.map()` null crashes
- Expanded middleware to protect all dashboard routes (explicit matcher — catch-all regex crashed Edge runtime)
- Added auth/error handling to domain list pages and null-safe domain table components
- `/api/notifications` now returns 401 instead of 500 when unauthenticated
