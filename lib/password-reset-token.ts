import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface TokenPayload {
  uid: number;
  exp: number;
}

function getSecret(): string {
  const s = process.env.PASSWORD_RESET_SECRET;
  if (!s || s.length < 32) {
    throw new Error("PASSWORD_RESET_SECRET missing or shorter than 32 chars");
  }
  return s;
}

function sign(payload: string, passwordHash: string): string {
  const key = getSecret() + passwordHash;
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createResetToken(uid: number, passwordHash: string): string {
  const payload: TokenPayload = { uid, exp: Date.now() + TOKEN_TTL_MS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(encoded, passwordHash);
  return `${encoded}.${sig}`;
}

export type VerifyResult =
  | { ok: true; uid: number }
  | { ok: false; reason: "invalid" | "expired" | "signature_mismatch" };

export function verifyResetToken(token: string, passwordHash: string): VerifyResult {
  const dotIndex = token.indexOf(".");
  if (dotIndex < 1) return { ok: false, reason: "invalid" };

  const encoded = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (!payload || typeof payload.uid !== "number" || typeof payload.exp !== "number") {
    return { ok: false, reason: "invalid" };
  }

  if (Date.now() > payload.exp) {
    return { ok: false, reason: "expired" };
  }

  const expected = sign(encoded, passwordHash);
  const sigBuf = Buffer.from(sig, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");

  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return { ok: false, reason: "signature_mismatch" };
  }

  return { ok: true, uid: payload.uid };
}
