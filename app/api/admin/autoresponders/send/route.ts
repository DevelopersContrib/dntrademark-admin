export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  requireAdmin,
  getAutoresponder,
  resolveAudienceEmails,
  markAutoresponderSent,
} from "@/lib/admin-queries";
import { sendMail, sendBulk } from "@/lib/mailer";

/**
 * POST body:
 *   { id, mode: "test", testEmail }      → send one copy to testEmail
 *   { id, mode: "broadcast" }            → send to the autoresponder's audience
 */
export const POST = async (req: Request) => {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid autoresponder id" }, { status: 400 });
    }

    const auto = await getAutoresponder(id);
    if (!auto) return NextResponse.json({ error: "Autoresponder not found" }, { status: 404 });

    if (body.mode === "test") {
      const email = String(body.testEmail || guard.user.email || "").trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return NextResponse.json({ error: "A valid test email is required." }, { status: 400 });
      }
      const res = await sendMail({ to: email, subject: `[TEST] ${auto.subject}`, html: auto.body });
      if (!res.ok) return NextResponse.json({ error: res.error || "Send failed" }, { status: 502 });
      return NextResponse.json({ success: true, mode: "test", to: email });
    }

    // Broadcast.
    const recipients = await resolveAudienceEmails(auto.audience);
    if (!recipients.length) {
      return NextResponse.json({ error: "No recipients match this audience." }, { status: 400 });
    }

    const result = await sendBulk(recipients, auto.subject, auto.body, { perEmailDelayMs: 60 });
    if (result.sent > 0) await markAutoresponderSent(id, result.sent);

    return NextResponse.json({
      success: result.failed === 0,
      mode: "broadcast",
      audience: auto.audience,
      recipients: recipients.length,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors.slice(0, 10),
    });
  } catch (error) {
    console.error("[admin/autoresponders/send] failed:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
};
