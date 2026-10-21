/**
 * Direct MySQL access for the admin dashboard (same `dntrademark` DB the
 * api-dntrademark service uses). Server-only — never imported into client code.
 *
 * Two pools:
 *   db()     – primary (read-write). All writes, transactions, and
 *              read-after-write queries MUST use this.
 *   dbRead() – read replica (vnocdb-read2). Pure SELECTs that tolerate a
 *              sub-second replication lag go here. Falls back to the primary
 *              when DB_READ_HOST is not set.
 */
import mysql, { Pool } from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  writePool: Pool | undefined;
  readPool: Pool | undefined;
};

function createWritePool(): Pool {
  return mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    charset: "utf8mb4",
    connectTimeout: 10_000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30_000,
  });
}

function createReadPool(): Pool {
  const hasReadHost = !!process.env.DB_READ_HOST;
  return mysql.createPool({
    host: hasReadHost ? process.env.DB_READ_HOST : process.env.DB_HOST,
    port: Number(hasReadHost ? process.env.DB_READ_PORT : process.env.DB_PORT) || 3306,
    user: hasReadHost ? process.env.DB_READ_USER : process.env.DB_USER,
    password: hasReadHost ? process.env.DB_READ_PASSWORD : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 3,
    charset: "utf8mb4",
    connectTimeout: 10_000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30_000,
  });
}

/** Primary (read-write) pool. */
export function db(): Pool {
  if (!globalForDb.writePool) globalForDb.writePool = createWritePool();
  return globalForDb.writePool;
}

/** Read-replica pool (falls back to primary when DB_READ_HOST is unset). */
export function dbRead(): Pool {
  if (!globalForDb.readPool) globalForDb.readPool = createReadPool();
  return globalForDb.readPool;
}

/* ── Primary helpers (writes + read-after-write) ─────────────────────── */

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const [rows] = await db().query(sql, params);
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length ? rows[0] : null;
}

export async function execute(
  sql: string,
  params?: unknown[],
): Promise<mysql.ResultSetHeader> {
  const [result] = await db().execute(sql, params as never);
  return result as mysql.ResultSetHeader;
}

/* ── Read-replica helpers (pure SELECTs only) ────────────────────────── */

export async function readQuery<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const [rows] = await dbRead().query(sql, params);
  return rows as T[];
}

export async function readQueryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T | null> {
  const rows = await readQuery<T>(sql, params);
  return rows.length ? rows[0] : null;
}
