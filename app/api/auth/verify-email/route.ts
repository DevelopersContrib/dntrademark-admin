import { NextResponse } from "next/server";
import { verifyVerificationToken } from "@/lib/email-verification";
import { execute, queryOne } from "@/lib/db";
import { getAuthBaseUrl } from "@/lib/auth-url";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";
  const baseUrl = getAuthBaseUrl().replace(/\/$/, "");

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/auth/verify-email-result?status=invalid`);
  }

  const result = verifyVerificationToken(token);

  if (!result.ok) {
    return NextResponse.redirect(
      `${baseUrl}/auth/verify-email-result?status=${result.reason}`,
    );
  }

  const user = await queryOne<{ id: number; email: string; email_verified_at: string | null }>(
    "SELECT id, email, email_verified_at FROM users WHERE id = ? LIMIT 1",
    [result.uid],
  );

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/auth/verify-email-result?status=invalid`);
  }

  if (user.email_verified_at) {
    return NextResponse.redirect(`${baseUrl}/auth/verify-email-result?status=already_verified`);
  }

  if (user.email.toLowerCase() !== result.email.toLowerCase()) {
    return NextResponse.redirect(`${baseUrl}/auth/verify-email-result?status=invalid`);
  }

  await execute(
    "UPDATE users SET email_verified_at = NOW(), updated_at = NOW() WHERE id = ?",
    [result.uid],
  );

  return NextResponse.redirect(`${baseUrl}/auth/verify-email-result?status=success`);
}
