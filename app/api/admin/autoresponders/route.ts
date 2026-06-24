export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  requireAdmin,
  listAutoresponders,
  createAutoresponder,
} from "@/lib/admin-queries";

export const GET = async () => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const data = await listAutoresponders();
  return NextResponse.json({ data });
};

export const POST = async (req: Request) => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  try {
    const body = await req.json();
    const result = await createAutoresponder({
      name: body.name,
      subject: body.subject,
      body: body.body,
      trigger_event: body.trigger_event,
      audience: body.audience,
      is_active: body.is_active,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("[admin/autoresponders] create failed:", error);
    return NextResponse.json({ error: "Failed to create autoresponder" }, { status: 500 });
  }
};
