/**
 * Admin-only data layer for the admin dashboard.
 *
 * Everything here is server-only and gated behind `is_admin`. The public-facing
 * lib/db-queries.ts keys every query on the *session* user id; this module is
 * the deliberate exception — an admin operates across all users, so callers must
 * pass through `requireAdmin()` (which 401/403s non-admins) before using the
 * CRUD helpers below.
 */
import bcrypt from "bcryptjs";
import { query, queryOne, execute } from "@/lib/db";
import { getSessionUserId } from "@/lib/db-queries";

export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  package_id: number | null;
  is_admin: number;
  is_onboarding: number;
  allow_email: number;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type AdminGuard =
  | { ok: true; user: AdminUser }
  | { ok: false; status: 401 | 403 };

/** Parse the ADMIN_EMAILS env var into a normalized set of allowed emails. */
function adminEmailSet(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(/[,\s]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Whether an email is an authorized admin per the .env allow-list.
 * `ADMIN_EMAILS` is the source of truth; the DB `is_admin` flag is only used as
 * a fallback when the env var is not configured (so the dashboard isn't locked
 * out if someone forgets to set it).
 */
export function isAdminEmail(email: string | null | undefined, dbIsAdmin = false): boolean {
  const allow = adminEmailSet();
  if (allow.size === 0) return dbIsAdmin;
  return !!email && allow.has(email.trim().toLowerCase());
}

/**
 * Resolve the current session user and confirm they are an admin.
 * Returns a discriminated result so API routes can map it to 401/403.
 */
export async function requireAdmin(): Promise<AdminGuard> {
  const userId = await getSessionUserId();
  if (!userId) return { ok: false, status: 401 };

  const user = await queryOne<AdminUser>(
    `SELECT id, first_name, last_name, email, package_id, is_admin, is_onboarding,
            allow_email, email_verified_at, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [userId],
  );

  if (!user) return { ok: false, status: 401 };
  if (!isAdminEmail(user.email, Number(user.is_admin) === 1)) {
    return { ok: false, status: 403 };
  }
  return { ok: true, user };
}

/** Lightweight check used by the sidebar / page guards. */
export async function isSessionAdmin(): Promise<boolean> {
  const guard = await requireAdmin();
  return guard.ok;
}

/* ──────────────────────────────────────────────────────────────────────────
 * User CRUD
 * ────────────────────────────────────────────────────────────────────────── */

const USER_SORT = ["id", "first_name", "last_name", "email", "created_at", "is_admin"];

export interface AdminUserListOpts {
  limit?: number;
  page?: number;
  sortBy?: string;
  orderBy?: string;
  search?: string;
}

export interface AdminUserListResult {
  data: AdminUser[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

export async function adminListUsers(opts: AdminUserListOpts = {}): Promise<AdminUserListResult> {
  const limit = opts.limit && opts.limit > 0 ? Math.min(opts.limit, 100) : 10;
  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const offset = (page - 1) * limit;
  const sortBy = USER_SORT.includes(opts.sortBy || "") ? (opts.sortBy as string) : "id";
  const orderBy = (opts.orderBy || "").toUpperCase() === "ASC" ? "ASC" : "DESC";
  const search = opts.search?.trim();

  const where = search
    ? "WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?"
    : "";
  const like = `%${search}%`;
  const whereParams = search ? [like, like, like] : [];

  const data = await query<AdminUser>(
    `SELECT id, first_name, last_name, email, package_id, is_admin, is_onboarding,
            allow_email, email_verified_at, created_at, updated_at
     FROM users ${where} ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
    [...whereParams, limit, offset],
  );
  const cnt = await queryOne<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt FROM users ${where}`,
    whereParams,
  );
  const total = Number(cnt?.cnt) || 0;

  return { data, total, page, per_page: limit, last_page: Math.max(1, Math.ceil(total / limit)) };
}

export async function adminGetUser(id: number): Promise<AdminUser | null> {
  return queryOne<AdminUser>(
    `SELECT id, first_name, last_name, email, package_id, is_admin, is_onboarding,
            allow_email, email_verified_at, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [id],
  );
}

export interface CreateUserInput {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  is_admin?: boolean;
  package_id?: number | null;
  allow_email?: boolean;
}

export type AdminMutationResult =
  | { ok: true; id: number }
  | { ok: false; error: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function adminCreateUser(input: CreateUserInput): Promise<AdminMutationResult> {
  const first = (input.first_name || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  const password = input.password || "";

  if (!first) return { ok: false, error: "First name is required." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "A valid email is required." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const existing = await queryOne<{ id: number }>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing) return { ok: false, error: "A user with that email already exists." };

  const hash = await bcrypt.hash(password, 10);
  const res = await execute(
    `INSERT INTO users
       (first_name, last_name, email, password, is_admin, package_id, allow_email, is_onboarding, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
    [
      first,
      (input.last_name || "").trim(),
      email,
      hash,
      input.is_admin ? 1 : 0,
      input.package_id ?? null,
      input.allow_email === false ? 0 : 1,
    ],
  );
  return { ok: true, id: res.insertId };
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  is_admin?: boolean;
  package_id?: number | null;
  allow_email?: boolean;
}

export async function adminUpdateUser(id: number, input: UpdateUserInput): Promise<AdminMutationResult> {
  const current = await adminGetUser(id);
  if (!current) return { ok: false, error: "User not found." };

  const sets: string[] = [];
  const params: unknown[] = [];

  if (input.first_name !== undefined) {
    const v = input.first_name.trim();
    if (!v) return { ok: false, error: "First name cannot be empty." };
    sets.push("first_name = ?");
    params.push(v);
  }
  if (input.last_name !== undefined) {
    sets.push("last_name = ?");
    params.push(input.last_name.trim());
  }
  if (input.email !== undefined) {
    const email = input.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return { ok: false, error: "A valid email is required." };
    const clash = await queryOne<{ id: number }>(
      "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
      [email, id],
    );
    if (clash) return { ok: false, error: "Another user already uses that email." };
    sets.push("email = ?");
    params.push(email);
  }
  if (input.password) {
    if (input.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    sets.push("password = ?");
    params.push(await bcrypt.hash(input.password, 10));
  }
  if (input.is_admin !== undefined) {
    sets.push("is_admin = ?");
    params.push(input.is_admin ? 1 : 0);
  }
  if (input.package_id !== undefined) {
    sets.push("package_id = ?");
    params.push(input.package_id ?? null);
  }
  if (input.allow_email !== undefined) {
    sets.push("allow_email = ?");
    params.push(input.allow_email ? 1 : 0);
  }

  if (!sets.length) return { ok: true, id };

  sets.push("updated_at = NOW()");
  await execute(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, [...params, id]);
  return { ok: true, id };
}

export async function adminDeleteUser(id: number, currentAdminId: number): Promise<AdminMutationResult> {
  if (id === currentAdminId) return { ok: false, error: "You cannot delete your own account." };
  const current = await adminGetUser(id);
  if (!current) return { ok: false, error: "User not found." };
  await execute("DELETE FROM users WHERE id = ?", [id]);
  return { ok: true, id };
}

export async function adminUserStats() {
  const row = await queryOne<{ total: number; admins: number; verified: number; emailable: number }>(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN is_admin = 1 THEN 1 ELSE 0 END) AS admins,
       SUM(CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END) AS verified,
       SUM(CASE WHEN allow_email = 1 THEN 1 ELSE 0 END) AS emailable
     FROM users`,
  );
  return {
    total: Number(row?.total) || 0,
    admins: Number(row?.admins) || 0,
    verified: Number(row?.verified) || 0,
    emailable: Number(row?.emailable) || 0,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Autoresponders (email automations sent via SES)
 *
 * Stored in its own table created on demand so deploying the admin dashboard
 * needs no manual migration. Tracks a trigger ("welcome" fires automatically
 * when an admin creates a user; "manual" is broadcast on demand).
 * ────────────────────────────────────────────────────────────────────────── */

export type AutoTrigger = "welcome" | "manual";
export type AutoAudience = "all" | "emailable" | "admins";

export interface Autoresponder {
  id: number;
  name: string;
  subject: string;
  body: string;
  trigger_event: AutoTrigger;
  audience: AutoAudience;
  is_active: number;
  send_count: number;
  last_sent_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

let autoTableReady = false;

async function ensureAutoresponderTable(): Promise<void> {
  if (autoTableReady) return;
  await execute(
    `CREATE TABLE IF NOT EXISTS autoresponders (
       id INT UNSIGNED NOT NULL AUTO_INCREMENT,
       name VARCHAR(191) NOT NULL,
       subject VARCHAR(255) NOT NULL,
       body MEDIUMTEXT NOT NULL,
       trigger_event VARCHAR(32) NOT NULL DEFAULT 'manual',
       audience VARCHAR(32) NOT NULL DEFAULT 'emailable',
       is_active TINYINT(1) NOT NULL DEFAULT 1,
       send_count INT NOT NULL DEFAULT 0,
       last_sent_at TIMESTAMP NULL DEFAULT NULL,
       created_at TIMESTAMP NULL DEFAULT NULL,
       updated_at TIMESTAMP NULL DEFAULT NULL,
       PRIMARY KEY (id)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );
  autoTableReady = true;
}

function normTrigger(v: unknown): AutoTrigger {
  return v === "welcome" ? "welcome" : "manual";
}

function normAudience(v: unknown): AutoAudience {
  return v === "all" || v === "admins" ? v : "emailable";
}

export async function listAutoresponders(): Promise<Autoresponder[]> {
  await ensureAutoresponderTable();
  return query<Autoresponder>("SELECT * FROM autoresponders ORDER BY id DESC");
}

export async function getAutoresponder(id: number): Promise<Autoresponder | null> {
  await ensureAutoresponderTable();
  return queryOne<Autoresponder>("SELECT * FROM autoresponders WHERE id = ? LIMIT 1", [id]);
}

/** The first active autoresponder for a given trigger, used by hooks. */
export async function getActiveAutoresponderByTrigger(trigger: AutoTrigger): Promise<Autoresponder | null> {
  await ensureAutoresponderTable();
  return queryOne<Autoresponder>(
    "SELECT * FROM autoresponders WHERE trigger_event = ? AND is_active = 1 ORDER BY id ASC LIMIT 1",
    [trigger],
  );
}

export interface AutoresponderInput {
  name: string;
  subject: string;
  body: string;
  trigger_event?: AutoTrigger;
  audience?: AutoAudience;
  is_active?: boolean;
}

export async function createAutoresponder(input: AutoresponderInput): Promise<AdminMutationResult> {
  await ensureAutoresponderTable();
  const name = (input.name || "").trim();
  const subject = (input.subject || "").trim();
  const body = input.body || "";
  if (!name) return { ok: false, error: "Name is required." };
  if (!subject) return { ok: false, error: "Subject is required." };
  if (!body.trim()) return { ok: false, error: "Email body is required." };

  const res = await execute(
    `INSERT INTO autoresponders
       (name, subject, body, trigger_event, audience, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      name,
      subject,
      body,
      normTrigger(input.trigger_event),
      normAudience(input.audience),
      input.is_active === false ? 0 : 1,
    ],
  );
  return { ok: true, id: res.insertId };
}

export async function updateAutoresponder(id: number, input: AutoresponderInput): Promise<AdminMutationResult> {
  await ensureAutoresponderTable();
  const existing = await getAutoresponder(id);
  if (!existing) return { ok: false, error: "Autoresponder not found." };

  const name = (input.name ?? existing.name).trim();
  const subject = (input.subject ?? existing.subject).trim();
  const body = input.body ?? existing.body;
  if (!name) return { ok: false, error: "Name is required." };
  if (!subject) return { ok: false, error: "Subject is required." };
  if (!body.trim()) return { ok: false, error: "Email body is required." };

  await execute(
    `UPDATE autoresponders
        SET name = ?, subject = ?, body = ?, trigger_event = ?, audience = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?`,
    [
      name,
      subject,
      body,
      normTrigger(input.trigger_event ?? existing.trigger_event),
      normAudience(input.audience ?? existing.audience),
      input.is_active === undefined ? existing.is_active : input.is_active ? 1 : 0,
      id,
    ],
  );
  return { ok: true, id };
}

export async function deleteAutoresponder(id: number): Promise<AdminMutationResult> {
  await ensureAutoresponderTable();
  const existing = await getAutoresponder(id);
  if (!existing) return { ok: false, error: "Autoresponder not found." };
  await execute("DELETE FROM autoresponders WHERE id = ?", [id]);
  return { ok: true, id };
}

export async function markAutoresponderSent(id: number, count: number): Promise<void> {
  await ensureAutoresponderTable();
  await execute(
    "UPDATE autoresponders SET send_count = send_count + ?, last_sent_at = NOW(), updated_at = NOW() WHERE id = ?",
    [count, id],
  );
}

/** Resolve the recipient email list for an audience selector. */
export async function resolveAudienceEmails(audience: AutoAudience): Promise<string[]> {
  const conds = ["email IS NOT NULL", "email <> ''"];
  if (audience === "emailable") conds.push("allow_email = 1");
  else if (audience === "admins") conds.push("is_admin = 1");

  const rows = await query<{ email: string }>(
    `SELECT email FROM users WHERE ${conds.join(" AND ")}`,
  );
  return rows.map((r) => r.email).filter(Boolean);
}
