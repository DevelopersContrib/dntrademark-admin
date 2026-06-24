export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-queries";

export const GET = async () => {
  const guard = await requireAdmin();
  return NextResponse.json({ isAdmin: guard.ok });
};
