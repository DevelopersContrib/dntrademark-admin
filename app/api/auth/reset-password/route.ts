import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/lib/db";
import { verifyResetToken } from "@/lib/password-reset-token";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = (body?.token ?? "").trim();
    const password = body?.password ?? "";
    const confirmPassword = body?.confirmPassword ?? "";

    if (!token) {
      return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const user = await decodeAndVerify(token);
    if (!user.ok) {
      const msg =
        user.reason === "expired"
          ? "This reset link has expired. Please request a new one."
          : "Invalid or already-used reset link.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    const laravelHash = hash.replace(/^\$2a\$/, "$2y$");

    await execute("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?", [
      laravelHash,
      user.uid,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[reset-password] error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function decodeAndVerify(token: string) {
  let payload: { uid: number };
  try {
    const dotIndex = token.indexOf(".");
    if (dotIndex < 1) return { ok: false as const, reason: "invalid" as const };
    const encoded = token.slice(0, dotIndex);
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return { ok: false as const, reason: "invalid" as const };
  }

  if (!payload?.uid || typeof payload.uid !== "number") {
    return { ok: false as const, reason: "invalid" as const };
  }

  const user = await queryOne<{ id: number; password: string }>(
    "SELECT id, password FROM users WHERE id = ? LIMIT 1",
    [payload.uid],
  );

  if (!user || !user.password) {
    return { ok: false as const, reason: "invalid" as const };
  }

  const result = verifyResetToken(token, user.password);
  if (!result.ok) {
    return { ok: false as const, reason: result.reason };
  }

  return { ok: true as const, uid: user.id };
}
