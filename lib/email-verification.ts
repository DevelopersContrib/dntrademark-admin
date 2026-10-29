import { createHmac, timingSafeEqual } from "crypto";
import { sendMail } from "@/lib/mailer";
import { getAuthBaseUrl } from "@/lib/auth-url";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface TokenPayload {
  uid: number;
  email: string;
  exp: number;
}

function getSecret(): string {
  const s = process.env.EMAIL_VERIFICATION_SECRET || process.env.PASSWORD_RESET_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "EMAIL_VERIFICATION_SECRET (or PASSWORD_RESET_SECRET fallback) missing or shorter than 32 chars",
    );
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createVerificationToken(uid: number, email: string): string {
  const payload: TokenPayload = {
    uid,
    email: email.toLowerCase().trim(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(encoded);
  return `${encoded}.${sig}`;
}

export type VerifyEmailResult =
  | { ok: true; uid: number; email: string }
  | { ok: false; reason: "invalid" | "expired" | "signature_mismatch" };

export function verifyVerificationToken(token: string): VerifyEmailResult {
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

  if (
    !payload ||
    typeof payload.uid !== "number" ||
    typeof payload.email !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return { ok: false, reason: "invalid" };
  }

  if (Date.now() > payload.exp) {
    return { ok: false, reason: "expired" };
  }

  const expected = sign(encoded);
  const sigBuf = Buffer.from(sig, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");

  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return { ok: false, reason: "signature_mismatch" };
  }

  return { ok: true, uid: payload.uid, email: payload.email };
}

function mailerConfigured(): boolean {
  return !!(process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD);
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  if (!mailerConfigured()) {
    console.error("[email-verification] mailer not configured — MAIL_HOST/MAIL_USERNAME/MAIL_PASSWORD missing");
    return false;
  }

  const baseUrl = (getAuthBaseUrl()).replace(/\/$/, "");
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  const result = await sendMail({
    to: email,
    subject: "Verify your DNTrademark email address",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Verify your email</h2>
        <p style="color: #475569;">
          Thanks for signing up for DNTrademark! Please verify your email address
          by clicking the button below. This link expires in 24 hours.
        </p>
        <p style="text-align: center; margin: 28px 0;">
          <a href="${verifyUrl}"
             style="display: inline-block; padding: 14px 32px; background-color: #10b981;
                    color: #ffffff; text-decoration: none; border-radius: 8px;
                    font-weight: 600; font-size: 14px;">
            Verify email address
          </a>
        </p>
        <p style="color: #94a3b8; font-size: 13px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  return result.ok;
}
