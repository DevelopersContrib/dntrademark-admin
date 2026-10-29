export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/lib/options";
import { readQueryOne } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(options);
  const uid = session?.id ? Number(session.id) : null;

  if (!uid || !Number.isFinite(uid) || uid <= 0) {
    return NextResponse.json({ verified: true });
  }

  const user = await readQueryOne<{ email_verified_at: string | null }>(
    "SELECT email_verified_at FROM users WHERE id = ? LIMIT 1",
    [uid],
  );

  return NextResponse.json({
    verified: !!user?.email_verified_at,
  });
}
