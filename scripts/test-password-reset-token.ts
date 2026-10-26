/**
 * Test script for password reset token sign/verify.
 * No test framework required — uses Node assert.
 *
 * Usage:  pnpm test:password-reset
 */

import assert from "node:assert/strict";

const TEST_SECRET = "test-password-reset-secret-that-is-at-least-32-characters!!";
const FAKE_HASH = "$2y$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ0123";

async function main() {
  process.env.PASSWORD_RESET_SECRET = TEST_SECRET;

  const { createResetToken, verifyResetToken } = await import(
    "../lib/password-reset-token.js"
  );

  // 1. Valid token round-trip
  const token = createResetToken(42, FAKE_HASH);
  assert.ok(token, "createResetToken should return a non-empty string");
  assert.ok(token.includes("."), "Token should contain a dot separator");

  const result = verifyResetToken(token, FAKE_HASH);
  assert.ok(result.ok, "Valid token should verify successfully");
  if (result.ok) {
    assert.equal(result.uid, 42, "UID should match");
  }

  // 2. Tampered token fails
  const tampered = token.slice(0, -3) + "xxx";
  const tamperedResult = verifyResetToken(tampered, FAKE_HASH);
  assert.ok(!tamperedResult.ok, "Tampered token should fail");
  if (!tamperedResult.ok) {
    assert.equal(tamperedResult.reason, "signature_mismatch");
  }

  // 3. Expired token fails
  const expiredPayload = JSON.stringify({ uid: 42, exp: Date.now() - 1000 });
  const expiredEncoded = Buffer.from(expiredPayload).toString("base64url");
  const { createHmac } = await import("node:crypto");
  const expiredSig = createHmac("sha256", TEST_SECRET + FAKE_HASH)
    .update(expiredEncoded)
    .digest("base64url");
  const expiredToken = `${expiredEncoded}.${expiredSig}`;
  const expiredResult = verifyResetToken(expiredToken, FAKE_HASH);
  assert.ok(!expiredResult.ok, "Expired token should fail");
  if (!expiredResult.ok) {
    assert.equal(expiredResult.reason, "expired");
  }

  // 4. Token invalid after password change (different hash)
  const newHash = "$2y$10$ZZZZZZZZZZZZZZZZZZZZZuABCDEFGHIJKLMNOPQRSTUVWXYZ9999";
  const changedResult = verifyResetToken(token, newHash);
  assert.ok(!changedResult.ok, "Token should fail after password change");
  if (!changedResult.ok) {
    assert.equal(changedResult.reason, "signature_mismatch");
  }

  // 5. Completely invalid tokens
  const garbageResult = verifyResetToken("not-a-token", FAKE_HASH);
  assert.ok(!garbageResult.ok, "Garbage token should fail");

  const emptyResult = verifyResetToken("", FAKE_HASH);
  assert.ok(!emptyResult.ok, "Empty token should fail");

  // 6. Missing secret fails closed
  delete process.env.PASSWORD_RESET_SECRET;
  assert.throws(
    () => createResetToken(1, FAKE_HASH),
    /PASSWORD_RESET_SECRET/,
    "Should throw when secret is missing",
  );

  // 7. Short secret fails closed
  process.env.PASSWORD_RESET_SECRET = "short";
  assert.throws(
    () => createResetToken(1, FAKE_HASH),
    /PASSWORD_RESET_SECRET/,
    "Should throw when secret is too short",
  );

  console.log("All password-reset-token tests passed.");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
