export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  requireAdmin,
  adminGetUser,
  adminUpdateUser,
  adminDeleteUser,
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

  const user = await adminGetUser(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const result = await adminUpdateUser(id, {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: body.password || undefined,
      is_admin: body.is_admin,
      package_id: body.package_id,
      allow_email: body.allow_email,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("[admin/users] update failed:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
};

export const DELETE = async (_req: Request, { params }: { params: { id: string } }) => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const result = await adminDeleteUser(id, guard.user.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true, id: result.id });
};
