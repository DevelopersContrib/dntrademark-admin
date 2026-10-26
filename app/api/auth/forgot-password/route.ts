import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { readQueryOne } from "@/lib/db";
import { createResetToken } from "@/lib/password-reset-token";
import { sendMail } from "@/lib/mailer";

const GENERIC_MSG = "If an account exists for that email, we've sent a reset link.";

const rateBuckets = new Map<string, number>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 3;

function isRateLimited(ip: string, email: string): boolean {
  const key = `${ip}:${email}`;
  const now = Date.now();
  const last = rateBuckets.get(key);

  if (last && now - last < RATE_WINDOW_MS / RATE_LIMIT) {
    return true;
  }
  rateBuckets.set(key, now);

  if (rateBuckets.size > 10_000) {
    const cutoff = now - RATE_WINDOW_MS;
    rateBuckets.forEach((t, k) => {
      if (t < cutoff) rateBuckets.delete(k);
    });
  }
  return false;
}

function mailerConfigured(): boolean {
  return !!(process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ message: GENERIC_MSG });
    }

    const headersList = headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip, email)) {
      return NextResponse.json({ message: GENERIC_MSG });
    }

    const user = await readQueryOne<{ id: number; password: string }>(
      "SELECT id, password FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (!user || !user.password) {
      return NextResponse.json({ message: GENERIC_MSG });
    }

    const token = createResetToken(user.id, user.password);
    const baseUrl = (process.env.NEXTAUTH_URL || "https://dash.dntrademark.com").replace(/\/$/, "");
    const resetUrl = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;

    if (!mailerConfigured()) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[forgot-password] mail not configured — reset URL generated (not logged in production)");
      } else {
        console.log("[forgot-password] mail not configured");
      }
      return NextResponse.json({ message: GENERIC_MSG });
    }

    await sendMail({
      to: email,
      subject: "Reset your DNTrademark password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Reset your password</h2>
          <p style="color: #475569;">
            We received a request to reset the password for your DNTrademark account.
            Click the button below to set a new password. This link expires in 30 minutes.
          </p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}"
               style="display: inline-block; padding: 14px 32px; background-color: #3b82f6;
                      color: #ffffff; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 14px;">
              Reset password
            </a>
          </p>
          <p style="color: #94a3b8; font-size: 13px;">
            If you didn't request this, you can safely ignore this email.
            Your password will not change until you create a new one.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: GENERIC_MSG });
  } catch (error) {
    console.error("[forgot-password] error:", error);
    return NextResponse.json({ message: GENERIC_MSG });
  }
}
