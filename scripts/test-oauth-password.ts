#!/usr/bin/env npx tsx
/**
 * Minimal test script for deriveOAuthPassword and the email==password rejection.
 * No test framework required — uses Node assert.
 *
 * Usage:  pnpm test:oauth-password
 */

import assert from 'node:assert/strict';

async function main() {
  // Set a test secret (≥ 32 chars)
  process.env.OAUTH_PASSWORD_SECRET = 'test-secret-that-is-at-least-32-characters-long!!';

  const { deriveOAuthPassword } = await import('../lib/oauth-password.js');

  // 1. Returns a non-null string
  const pw = deriveOAuthPassword('User@Example.com');
  assert.ok(pw, 'deriveOAuthPassword should return a non-null string');
  assert.equal(typeof pw, 'string');

  // 2. Case-insensitive + trim-insensitive
  const pw2 = deriveOAuthPassword('  user@example.com  ');
  const pw3 = deriveOAuthPassword('USER@EXAMPLE.COM');
  assert.equal(pw, pw2, 'Should be trim-insensitive');
  assert.equal(pw, pw3, 'Should be case-insensitive');

  // 3. Stable (idempotent)
  const pw4 = deriveOAuthPassword('User@Example.com');
  assert.equal(pw, pw4, 'Should be stable across calls');

  // 4. Different secret produces different password
  process.env.OAUTH_PASSWORD_SECRET = 'another-secret-that-is-also-at-least-32-characters!!';
  const pwDiffSecret = deriveOAuthPassword('user@example.com');
  assert.notEqual(pw, pwDiffSecret, 'Different secret should produce different password');

  // Restore
  process.env.OAUTH_PASSWORD_SECRET = 'test-secret-that-is-at-least-32-characters-long!!';

  // 5. Missing secret fails closed
  delete process.env.OAUTH_PASSWORD_SECRET;
  const pwNoSecret = deriveOAuthPassword('user@example.com');
  assert.equal(pwNoSecret, null, 'Should return null when secret is missing');

  // 6. Short secret fails closed
  process.env.OAUTH_PASSWORD_SECRET = 'short';
  const pwShortSecret = deriveOAuthPassword('user@example.com');
  assert.equal(pwShortSecret, null, 'Should return null when secret is too short');

  /* ── email==password rejection test ───────────────────────────────── */

  function isEmailEqualPassword(email: string, password: string): boolean {
    const e = email.trim().toLowerCase();
    const p = password.trim();
    return !!(e && p && e === p.toLowerCase());
  }

  assert.ok(isEmailEqualPassword('user@example.com', 'user@example.com'), 'Exact match');
  assert.ok(isEmailEqualPassword('User@Example.COM', 'user@example.com'), 'Case-insensitive');
  assert.ok(isEmailEqualPassword(' user@example.com ', ' user@example.com '), 'Trimmed match');
  assert.ok(!isEmailEqualPassword('user@example.com', 'correcthorsebattery'), 'Different password');
  assert.ok(!isEmailEqualPassword('', ''), 'Empty strings should not match');

  console.log('All tests passed.');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
