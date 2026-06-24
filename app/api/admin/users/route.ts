export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  requireAdmin,
  adminListUsers,
  adminCreateUser,
  adminUserStats,
} from "@/lib/admin-queries";
import { getActiveAutoresponderByTrigger, markAutoresponderSent } from "@/lib/admin-queries";
import { sendMail } from "@/lib/mailer";

export const GET = async (req: Request) => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
  }

  const { searchParams } = new URL(req.url);
  const result = await adminListUsers({
    limit: Number(searchParams.get("limit")) || 10,
    page: Number(searchParams.get("page")) || 1,
    sortBy: searchParams.get("sortBy") || undefined,
    orderBy: searchParams.get("orderBy") || undefined,
    search: searchParams.get("search") || undefined,
  });
  const stats = await adminUserStats();
  return NextResponse.json({ ...result, stats });
};

export const POST = async (req: Request) => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
  }

  try {
    const body = await req.json();
    const result = await adminCreateUser({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: body.password,
      is_admin: !!body.is_admin,
      package_id: body.package_id ?? null,
      allow_email: body.allow_email !== false,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Fire the "welcome" autoresponder for the freshly created user, if one is active.
    let welcomeSent = false;
    if (body.allow_email !== false) {
      const welcome = await getActiveAutoresponderByTrigger("welcome");
      if (welcome) {
        const sent = await sendMail({
          to: String(body.email).trim().toLowerCase(),
          subject: welcome.subject,
          html: welcome.body,
        });
        if (sent.ok) {
          await markAutoresponderSent(welcome.id, 1);
          welcomeSent = true;
        }
      }
    }

    return NextResponse.json({ success: true, id: result.id, welcomeSent });
  } catch (error) {
    console.error("[admin/users] create failed:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
};
