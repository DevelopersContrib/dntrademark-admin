export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  requireAdmin,
  getAutoresponder,
  updateAutoresponder,
  deleteAutoresponder,
} from "@/lib/admin-queries";

function parseId(param: string): number | null {
  const id = Number(param);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const item = await getAutoresponder(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const result = await updateAutoresponder(id, {
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
    console.error("[admin/autoresponders] update failed:", error);
    return NextResponse.json({ error: "Failed to update autoresponder" }, { status: 500 });
  }
};

export const DELETE = async (_req: Request, { params }: { params: { id: string } }) => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const result = await deleteAutoresponder(id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true, id: result.id });
};
