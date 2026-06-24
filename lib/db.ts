/**
 * Direct MySQL access for the admin dashboard (same `dntrademark` DB the
 * api-dntrademark service uses). Server-only — never imported into client code.
 *
 * Using the DB directly (keyed on the NextAuth session user id) avoids the
 * Sanctum bearer-token round-trip to api.dntrademark.com that was 401-ing and
 * bouncing users back to the login screen.
 */
import mysql, { Pool } from "mysql2/promise";

let pool: Pool | null = null;

export function db(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      charset: "utf8mb4",
    });
  }
  return pool;
}

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
