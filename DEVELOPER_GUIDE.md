# DNTrademark Admin — Quick Map

A flat list of every **page**, **API route**, and **component**, with:
- **Edit here** — the file you change.
- **Powered by** — the function + database table behind it.

### How data works (10-second version)
- A **page** = a URL the user visits → it renders a **component**.
- The component gets data either from a **server function** (`lib/data.tsx`) or by calling an **API route** (`app/api/...`).
- Those call **`lib/db-queries.ts`**, which runs the SQL on **MySQL** (via `lib/db.ts`).
- Some old features instead call the **Laravel API** (`api.dntrademark.com`) — marked 🌐 below.

### Tables (the database)
`domains` · `domain_items` · `domains_items_owners` · `users` · `packages` · `invoices` · `autoresponders`
> `domains.no_of_items`: **NULL** = not scanned yet · **0** = no conflicts · **>0** = has hits.

---

## 1. Pages (what the user sees)

✅ = direct MySQL · 🌐 = Laravel API · 🧩 = template demo (no data)

### Core
| URL | Edit page | Edit UI | Powered by → table |
| --- | --- | --- | --- |
| `/` (dashboard) | `app/(dashboard)/page.tsx` | `components/Dashboard/E-commerce.tsx` | ✅ `getDomainStats`, `getDomainList`, `getGraph`, `getUserPlan` → `domains`, `domain_items` |

### Domains
| URL | Edit page | Edit UI | Powered by → table |
| --- | --- | --- | --- |
| `/domains/all` | `app/(dashboard)/domains/all/page.tsx` | `components/Domains/AllDomains.tsx` | ✅ `/api/domain/list` → `listDomains` → `domains` |
| `/domains/with-hits` | `app/(dashboard)/domains/with-hits/page.tsx` | `components/Domains/WithHits.tsx` | ✅ `/api/domain/withhits` → `listDomainsWithHits` → `domains` |
| `/domains/without-hits` | `app/(dashboard)/domains/without-hits/page.tsx` | `components/Domains/WithoutHits.tsx` | ✅ `/api/domain/withouthits` → `listDomainsWithoutHits` → `domains` |
| `/domains/monitor` | `app/(dashboard)/domains/monitor/page.tsx` | `components/Monitoring/DomainMonitor.tsx` | ✅ `/api/domain/monitor`, `/status`, `/monitor-add`, `/scan` → `listMonitorDomains`, `insertMonitorDomains`, `scanDomain` → `domains`, `domain_items`, `domains_items_owners` |
| `/domains/add` | `app/(dashboard)/domains/add/page.tsx` | `components/onboarding/DomainForm.tsx`, `UploadForm.tsx`, `Dashboard/UpgradeBanner.tsx` | 🌐 `/api/domain/add` (Laravel) + ✅ `getPlan` → `domains`, `packages` |
| `/domains/items/[id]` (**report**) | `app/(dashboard)/domains/items/[id]/page.tsx` | `components/Domains/DomainReport.tsx` | ✅ `getDomainReport` (+ `/api/domain/scan`, `/api/domain/report-email`) → `domains`, `domain_items`, `domains_items_owners`, `users` |
| `/items/[id]` | `app/(dashboard)/items/[id]/page.tsx` | `components/Items/ItemsDetails.tsx` | 🌐 `getItem` → `domain_items` (via Laravel) |
| `/domains/items/protest/[id]` | `app/(dashboard)/domains/items/protest/[id]/page.tsx` | `components/Protest/ProtestList.tsx` | 🌐 `getItem`, `getItemProtestList` → protest letters (via Laravel) |

### Billing & payments
| URL | Edit page | Edit UI | Powered by → table |
| --- | --- | --- | --- |
| `/pricing` | `app/(dashboard)/pricing/page.tsx` | `components/Pricing/PackagesNew.tsx` | ✅ `getUser` + plan catalog → `users`, `packages` |
| `/billing` | `app/(dashboard)/billing/page.tsx` | `components/Billing/Billing.tsx` | ✅ `getInvoice` → `invoices` |
| `/invoices/details/[invoice_id]` | `app/(dashboard)/invoices/details/[invoice_id]/page.tsx` | `components/Invoice/Invoice.tsx` | 🌐 `getInvoiceDetails` → `invoices` (via Laravel) |
| `/checkout/[id]` | `app/(dashboard)/checkout/[id]/page.tsx` | `components/Checkout/CheckoutForm.tsx` | 🌐 `/api/charge` (Stripe + Laravel) → `users`, `packages` |

### Account
| URL | Edit page | Edit UI | Powered by → table |
| --- | --- | --- | --- |
| `/settings` | `app/(dashboard)/settings/page.tsx` | `components/Settings/*` | 🌐 `/api/user/update`, `/api/user/delete` → `users` |
| `/notifications` | `app/(dashboard)/notifications/page.tsx` | `components/Notifications/Notifications.tsx` | 🌐 `/api/notifications` → notifications (via Laravel) |
| `/feedback` | `app/(dashboard)/feedback/page.tsx` | `components/Feedback/Feedback.tsx` | `/api/feedback/save` |
| `/onboarding` | `app/(dashboard)/onboarding/page.tsx` | `components/onboarding/OnboardContent.tsx` | 🌐 `/api/domain/add`, `/api/user/update` |

### Admin (gated by `ADMIN_EMAILS` / `users.is_admin`)
| URL | Edit page | Edit UI | Powered by → table |
| --- | --- | --- | --- |
| `/admin` | `app/(dashboard)/admin/page.tsx` | (inline) | ✅ `adminUserStats`, `listAutoresponders` → `users`, `autoresponders` |
| `/admin/users` | `app/(dashboard)/admin/users/page.tsx` | `components/Admin/AdminUsers.tsx` | ✅ `/api/admin/users` → `adminListUsers` etc → `users` |
| `/admin/autoresponders` | `app/(dashboard)/admin/autoresponders/page.tsx` | `components/Admin/AutoResponders.tsx` | ✅✉️ `/api/admin/autoresponders*` → `autoresponders`, `users` |

### Auth
| URL | Edit page | Edit UI | Powered by → table |
| --- | --- | --- | --- |
| `/auth/signin` | `app/auth/signin/page.tsx` | `components/Auth/SignInPageClient.tsx`, `SigninForm.tsx` | NextAuth (`lib/options.tsx`) + 🌐 `/api/auth/signin` → `users` |
| `/auth/signup` | `app/auth/signup/page.tsx` | `components/Auth/SignUpPageClient.tsx`, `SignupForm.tsx` | 🌐 `/api/auth/signup` → `users` |
| `/auth/register` | `app/auth/register/page.tsx` | — | 🌐 _duplicate of signup — candidate for removal_ |
| `/auth/signin-error` | `app/auth/signin-error/page.tsx` | — | error display only |

### Template demos (🧩 no data — safe to delete)
`/calendar`, `/chart`, `/tables`, `/ui/alerts`, `/ui/buttons`, `/forms/form-elements`, `/forms/form-layout`, `/settings2`

---

## 2. API routes (data endpoints, under `app/api/`)

✅ MySQL · 🌐 Laravel · ✉️ email · 🔎 USPTO · ☠️ dead/stub

| Route (POST unless noted) | Edit file | Powered by → table |
| --- | --- | --- |
| `domain/list` ✅ | `app/api/domain/list/route.tsx` | `listDomains` → `domains` |
| `domain/withhits` ✅ | `app/api/domain/withhits/route.tsx` | `listDomainsWithHits` → `domains` |
| `domain/withouthits` ✅ | `app/api/domain/withouthits/route.tsx` | `listDomainsWithoutHits` → `domains` |
| `domain/items` ✅ | `app/api/domain/items/route.tsx` | `listDomainItems` → `domain_items` |
| `domain/delete` ✅ | `app/api/domain/delete/route.tsx` | `deleteDomains` → `domains` |
| `domain/monitor` ✅ | `app/api/domain/monitor/route.tsx` | `listMonitorDomains`, `getMonitorSummary` → `domains`, `domain_items`, `domains_items_owners` |
| `domain/status` ✅ | `app/api/domain/status/route.tsx` | `getMonitorStatuses` → same |
| `domain/monitor-add` ✅ | `app/api/domain/monitor-add/route.tsx` | `insertMonitorDomains` → `domains`, `packages` |
| `domain/scan` ✅🔎 | `app/api/domain/scan/route.tsx` | `scanDomain` → writes `domain_items`, `domains_items_owners`, `domains` |
| `domain/report-email` ✅✉️ | `app/api/domain/report-email/route.tsx` | `getDomainReport`, `getUserById`, `sendMail` → `domains`, `domain_items`, `domains_items_owners`, `users` |
| `domain/add` 🌐 | `app/api/domain/add/route.tsx` | Laravel `/domains/add` |
| `domain/stats` ☠️ | `app/api/domain/stats/route.tsx` | returns `''` (dead — real stats are in `getDomainStats`) |
| `user/plan` ✅ | `app/api/user/plan/route.tsx` | `getUserPlan` → `users`, `packages` |
| `user/get` ☠️ | `app/api/user/get/route.tsx` | returns `{result:null}` (dead) |
| `user/update`, `user/delete`, `user/check`, `user/email-available` 🌐 | `app/api/user/*/route.tsx` | Laravel `/user/*` → `users` |
| `auth/signin`, `auth/signup` 🌐 | `app/api/auth/*/route.tsx` | Laravel `/auth/*` → `users` |
| `auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.tsx` | NextAuth → `lib/options.tsx` |
| `charge`, `chargeinvoice` 🌐 | `app/api/charge*/route.tsx` | Stripe + Laravel `/payment/charge` |
| `invoices` 🌐 | `app/api/invoices/route.tsx` | Laravel `/invoices` |
| `notifications`, `notifications/[id]` 🌐 | `app/api/notifications/*` | Laravel `/notifications` |
| `item/protest*`, `domain/items/protests/save` 🌐 | `app/api/item/protest/*`, `app/api/domain/items/protests/save` | Laravel `/items/protests/*` |
| `feedback/save` | `app/api/feedback/save/route.tsx` | feedback submit |
| `admin/users`, `admin/users/[id]` ✅ | `app/api/admin/users/*` | `admin-queries` → `users` |
| `admin/autoresponders*` ✅✉️ | `app/api/admin/autoresponders/*` | `admin-queries`, `sendMail`/`sendBulk` → `autoresponders`, `users` |
| `admin/check` ✅ | `app/api/admin/check/route.ts` | `requireAdmin` → `users` |

---

## 3. Components

### Feature components (have logic / load data)
| Component | Edit file | Used on | Gets data via → table |
| --- | --- | --- | --- |
| Dashboard | `components/Dashboard/E-commerce.tsx` | `/` | props from `getDomainStats`/`getDomainList`/`getGraph`/`getUserPlan` → `domains`, `domain_items` |
| Upgrade CTA | `components/Dashboard/UpgradeBanner.tsx` | `/`, `/domains/add`, `/domains/monitor` | `getUserPlan` → `users`, `packages` |
| Recent domains | `components/Domains/RecentDomains.tsx` | `/` | props from `getDomainList` → `domains` |
| All domains | `components/Domains/AllDomains.tsx` | `/domains/all` | `getDomains`, `deleteDomains`, `rescanDomain` → `domains` |
| With hits | `components/Domains/WithHits.tsx` | `/domains/with-hits` | `getDomainsWithHits` → `domains` |
| Without hits | `components/Domains/WithoutHits.tsx` | `/domains/without-hits` | `getDomainsWithOutHits` → `domains` |
| **Domain report** | `components/Domains/DomainReport.tsx` | `/domains/items/[id]` | `getDomainReport`, `rescanDomain`, `emailReport` → `domains`, `domain_items`, `domains_items_owners` |
| Monitoring board | `components/Monitoring/DomainMonitor.tsx` | `/domains/monitor` | `getMonitor`, `pollStatus`, `addMonitorDomains`, `rescanDomain` → `domains`, `domain_items` |
| Monitoring card | `components/Monitoring/DomainMonitorCard.tsx` | `/domains/monitor` | props (one domain) |
| Monitoring summary | `components/Monitoring/MonitorSummary.tsx` | `/domains/monitor` | props (counts) → `domains` |
| Add domain form | `components/onboarding/DomainForm.tsx` | `/domains/add`, `/onboarding` | `/api/domain/add` (🌐), `/api/user/update` → `domains` |
| Upload domains | `components/onboarding/UploadForm.tsx` | `/domains/add` | CSV → `/api/domain/add` 🌐 |
| Item details | `components/Items/ItemsDetails.tsx` | `/items/[id]` | `getItem` 🌐 → `domain_items` |
| Protest letters | `components/Protest/ProtestList.tsx` | `/domains/items/protest/[id]` | `getItemProtests` 🌐 → protests |
| Pricing | `components/Pricing/PackagesNew.tsx` | `/pricing` | props from `getUser` + plan catalog → `users`, `packages` |
| Billing list | `components/Billing/Billing.tsx` | `/billing` | props from `getInvoice` → `invoices` |
| Invoice detail | `components/Invoice/Invoice.tsx` | `/invoices/details/[id]` | `getInvoiceDetails` 🌐 → `invoices` |
| Checkout | `components/Checkout/CheckoutForm.tsx`, `StripeWrapper.tsx` | `/checkout/[id]` | `/api/charge` 🌐 (Stripe) |
| Settings tabs | `components/Settings/*` (Basic/Password/Email/Notification/Delete) | `/settings` | `/api/user/update`, `/api/user/delete` 🌐 → `users` |
| Notifications list | `components/Notifications/Notifications.tsx` | `/notifications` | `/api/notifications` 🌐 |
| Feedback | `components/Feedback/Feedback.tsx` | `/feedback`, dashboard | `/api/feedback/save` |
| Admin users | `components/Admin/AdminUsers.tsx` | `/admin/users` | `/api/admin/users` ✅ → `users` |
| Admin autoresponders | `components/Admin/AutoResponders.tsx` | `/admin/autoresponders` | `/api/admin/autoresponders*` ✅✉️ → `autoresponders` |
| Header notifications | `components/Header/DropdownNotification.tsx` | every page (header) | `/api/notifications` 🌐 |
| Latest blog | `components/Dashboard/LatestBlog.tsx` | `/` | `getFeed` (blog RSS) |

### Layout / chrome (structure, no data)
`components/Sidebar/index.tsx` (left nav — edit menu here) · `components/Sidebar/SidebarLinkGroup.tsx` · `components/Header/index.tsx` · `components/Header/DropdownUser.tsx` · `components/Header/DropdownMessage.tsx` _(links to `/messages` — dead)_ · `components/DashboardChrome.tsx` · `components/DashboardLayout.tsx` · `components/Breadcrumbs/Breadcrumb.tsx` · `components/Unauthenticated.tsx`

### UI primitives (presentational, no DB — mostly TailAdmin template)
`CardDataStats` · `Charts/*` · `Tables/*` · `Checkboxes/*` · `Switchers/*` · `Maps/MapOne` · `Calender/*` · `Chat/ChatCard` · `Dropdowns/DropdownDefault` · `common/Loader` · `Loading/LoadingRipple` · `DarkModeSwitcher` · `Dashboard/WelcomeNotif` · `Dashboard/TwitterPosts` · `onboarding/Tabs` · `Auth/*` (AuthCard, AuthSplitLayout, OAuthButtons, etc.)

---

## 4. Where the logic lives (lib files)

| Need to change… | Edit file |
| --- | --- |
| A SQL query / DB logic | `lib/db-queries.ts` |
| MySQL connection / `query`/`execute` | `lib/db.ts` |
| Server-component data fetch | `lib/data.tsx` |
| Client fetch wrappers (`getDomains`, `rescanDomain`, `emailReport`…) | `lib/domain-helper.tsx` |
| USPTO scan logic | `lib/scan.ts` + `lib/uspto.ts` |
| Report badges / risk / summary | `lib/report.ts` |
| Monitoring status labels/colors | `lib/monitor-status.ts` |
| Plan limits / upgrade rules | `lib/plan.ts` |
| Sending email (AWS SES) | `lib/mailer.ts` |
| Admin queries (users/autoresponders) | `lib/admin-queries.ts` |
| Login / OAuth config | `lib/options.tsx` |

> Known gaps & cleanup are tracked in **`GAPS_AND_TODOS.md`**.
