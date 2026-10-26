#!/usr/bin/env npx tsx
/**
 * One-time migration: re-hash OAuth users whose password is bcrypt(email)
 * to bcrypt(deriveOAuthPassword(email)).
 *
 * DRY RUN by default — prints count + user ids only.
 * Pass --apply to actually write the new hashes.
 *
 * Usage:
 *   pnpm migrate:oauth              # dry run
 *   pnpm migrate:oauth -- --apply   # write changes
 *
 * CLI flags (override if the DB schema differs from best-evidence defaults):
 *   --table <name>      users table name  (default: users)
 *   --column <name>     password column   (default: password)
 *   --batch-size <n>    rows per transaction batch (default: 100)
 *
 * Env required: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, OAUTH_PASSWORD_SECRET
 * Optional: DB_PORT (default 3306)
 *
 * NEVER prints emails, passwords, or hashes.
 */

import { createHmac } from 'crypto';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

/* ── CLI args ────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);

function flag(name: string, fallback: string): string {
  const idx = args.indexOf(name);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
}

const applyMode = args.includes('--apply');
const TABLE = flag('--table', 'users');
const COL = flag('--column', 'password');
const BATCH = Math.max(1, Number(flag('--batch-size', '100')));

/* ── Derive password (standalone, mirrors lib/oauth-password.ts) ─── */

function deriveOAuthPassword(email: string): string {
  const secret = process.env.OAUTH_PASSWORD_SECRET;
  if (!secret || secret.length < 32) {
    console.error('[migrate] OAUTH_PASSWORD_SECRET missing or too short');
    process.exit(1);
  }
  const hmac = createHmac('sha256', secret);
  hmac.update(email.trim().toLowerCase());
  return hmac.digest('base64url');
}

/* ── Main ────────────────────────────────────────────────────────────── */

async function main() {
  if (!process.env.DB_HOST || !process.env.DB_NAME) {
    console.error('[migrate] Missing DB_HOST or DB_NAME');
    process.exit(1);
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 3,
    charset: 'utf8mb4',
    connectTimeout: 10_000,
  });

  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT id, email, \`${COL}\` AS pwd FROM \`${TABLE}\` WHERE \`${COL}\` IS NOT NULL AND \`${COL}\` != ''`,
    );

    console.log(`[migrate] Scanning ${rows.length} rows in \`${TABLE}\`…`);

    const affected: { id: number; newHash: string }[] = [];

    for (const row of rows) {
      const email: string = row.email;
      const storedHash: string = row.pwd;
      if (!email || !storedHash) continue;

      // Laravel $2y$ → bcryptjs $2b$ for comparison
      const comparableHash = storedHash.replace(/^\$2y\$/, '$2b$');
      const emailIsPassword = await bcrypt.compare(email, comparableHash);
      if (!emailIsPassword) continue;

      const derived = deriveOAuthPassword(email);
      const newHash = await bcrypt.hash(derived, 10);
      // Convert back to $2y$ for PHP/Laravel compatibility
      const laravelHash = newHash.replace(/^\$2b\$/, '$2y$');

      affected.push({ id: row.id, newHash: laravelHash });
    }

    console.log(`[migrate] Found ${affected.length} OAuth account(s) with email-as-password.`);

    if (affected.length > 0) {
      console.log(`[migrate] User IDs: ${affected.map((a) => a.id).join(', ')}`);
    }

    if (!applyMode) {
      console.log('[migrate] DRY RUN — no changes written. Pass --apply to update.');
      await pool.end();
      return;
    }

    let updated = 0;
    for (let i = 0; i < affected.length; i += BATCH) {
      const batch = affected.slice(i, i + BATCH);
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        for (const { id, newHash } of batch) {
          await conn.execute(`UPDATE \`${TABLE}\` SET \`${COL}\` = ?, updated_at = NOW() WHERE id = ?`, [
            newHash,
            id,
          ]);
        }
        await conn.commit();
        updated += batch.length;
        console.log(`[migrate] Batch committed: ${updated}/${affected.length}`);
      } catch (err) {
        await conn.rollback();
        console.error(`[migrate] Batch starting at index ${i} failed, rolled back:`, err);
        throw err;
      } finally {
        conn.release();
      }
    }

    console.log(`[migrate] Done. ${updated} account(s) migrated.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('[migrate] Fatal:', err);
  process.exit(1);
});
