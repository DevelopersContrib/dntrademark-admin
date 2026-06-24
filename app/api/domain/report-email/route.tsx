export const dynamic = "force-dynamic";

import { getSessionUserId, getDomainReport, getUserById } from "@/lib/db-queries";
import { sendMail } from "@/lib/mailer";
import {
  deriveMarkState,
  matchType,
  usptoUrl,
  riskHeadline,
  reportYear,
  type DomainReport,
  type ReportItem,
} from "@/lib/report";

const esc = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const BANNER_BG: Record<string, string> = {
  action: "#fef2f2",
  review: "#fffbeb",
  clear: "#f0fdf4",
};
const BANNER_FG: Record<string, string> = {
  action: "#b91c1c",
  review: "#b45309",
  clear: "#15803d",
};
const TONE_FG: Record<string, string> = {
  danger: "#dc2626",
  warning: "#b45309",
  muted: "#6b7280",
};

function markRow(item: ReportItem, domainName: string): string {
  const state = deriveMarkState(item);
  const match = matchType(item, domainName);
  const ownerBits = [
    item.owner_name ? esc(item.owner_name) : null,
    item.serial_number && item.serial_number !== "0000000" ? `Serial ${esc(item.serial_number)}` : null,
    item.registration_number && item.registration_number !== "0000000"
      ? `Reg ${esc(item.registration_number)}`
      : null,
  ]
    .filter(Boolean)
    .join(" &middot; ");
  const filed = reportYear(item.filing_date);

  return `
  <tr>
    <td style="padding:14px 16px;border-bottom:1px solid #eef0f4;">
      <div style="font-size:15px;font-weight:600;color:#111827;">${esc(item.keyword) || "&mdash;"}</div>
      <div style="margin-top:4px;">
        <span style="font-size:12px;font-weight:600;color:${TONE_FG[state.tone]};">${esc(state.label)}</span>
        <span style="font-size:12px;color:#9ca3af;"> &nbsp;|&nbsp; </span>
        <span style="font-size:12px;font-weight:600;color:${match === "exact" ? "#dc2626" : "#6b7280"};">${match === "exact" ? "Exact match" : "Partial"}</span>
      </div>
      ${ownerBits ? `<div style="margin-top:6px;font-size:12px;color:#6b7280;">${ownerBits}</div>` : ""}
    </td>
    <td style="padding:14px 16px;border-bottom:1px solid #eef0f4;text-align:right;white-space:nowrap;vertical-align:top;">
      ${filed ? `<div style="font-size:12px;color:#9ca3af;">Filed ${filed}</div>` : ""}
      <a href="${usptoUrl(item)}" style="font-size:12px;color:#3b5bdb;text-decoration:none;">View on USPTO &rarr;</a>
    </td>
  </tr>`;
}

function tile(label: string, value: number | string): string {
  return `
  <td width="25%" style="padding:0 6px;">
    <div style="border:1px solid #eef0f4;border-radius:10px;padding:14px 16px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#9ca3af;">${esc(label)}</div>
      <div style="font-size:24px;font-weight:700;color:#111827;margin-top:2px;">${esc(value)}</div>
    </div>
  </td>`;
}

function buildReportEmailHtml(report: DomainReport, appUrl: string): string {
  const { domain, summary, items, risk_level } = report;
  const head = riskHeadline(report);
  const rows =
    items.length > 0
      ? items.map((i) => markRow(i, domain.domain_name)).join("")
      : `<tr><td style="padding:20px 16px;color:#15803d;font-size:14px;">No conflicting trademarks found for this domain.</td></tr>`;

  return `<!doctype html>
<html><body style="margin:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #eef0f4;">
        <tr><td style="padding:24px 24px 8px;">
          <div style="font-size:13px;color:#9ca3af;">DNTrademark report</div>
          <div style="font-size:22px;font-weight:700;color:#111827;margin-top:2px;">${esc(domain.domain_name)}</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:4px;">Trademark monitoring &middot; ${summary.total} mark${summary.total === 1 ? "" : "s"} on file</div>
        </td></tr>
        <tr><td style="padding:12px 24px 4px;">
          <div style="background:${BANNER_BG[risk_level]};border-radius:10px;padding:14px 16px;">
            <div style="font-size:14px;font-weight:700;color:${BANNER_FG[risk_level]};">${esc(head.title)}</div>
            <div style="font-size:13px;color:${BANNER_FG[risk_level]};margin-top:2px;">${esc(head.detail)}</div>
          </div>
        </td></tr>
        <tr><td style="padding:14px 18px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            ${tile("Total marks", summary.total)}
            ${tile("Live", summary.live)}
            ${tile("Exact", summary.exact)}
            ${tile("Owners", summary.owners)}
          </tr></table>
        </td></tr>
        <tr><td style="padding:14px 24px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef0f4;border-radius:10px;">${rows}</table>
        </td></tr>
        <tr><td style="padding:14px 24px 28px;">
          <a href="${appUrl}/domains/items/${domain.id}" style="display:inline-block;background:#3b5bdb;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:11px 18px;border-radius:9px;">Open full report</a>
          <div style="font-size:11px;color:#b0b6c1;margin-top:18px;">This report surfaces potential trademark signals, not legal conclusions. DNTrademark.com</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export const POST = async (req: Request) => {
  try {
    const data = await req.json().catch(() => ({}));
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthenticated" }), { status: 401 });
    }

    const domainId = Number(data.id);
    if (!Number.isFinite(domainId) || domainId <= 0) {
      return new Response(JSON.stringify({ error: "Invalid domain id" }), { status: 400 });
    }

    const report = await getDomainReport(userId, domainId);
    if (!report) {
      return new Response(JSON.stringify({ error: "Domain not found" }), { status: 404 });
    }

    const user = (await getUserById(userId)) as { email?: string; name?: string } | null;
    const to = (user?.email || "").trim();
    if (!to) {
      return new Response(JSON.stringify({ error: "No email on file for your account" }), { status: 422 });
    }

    const appUrl = (process.env.NEXTAUTH_URL || process.env.BASE_URL || "https://dash.dntrademark.com").replace(/\/$/, "");
    const head = riskHeadline(report);
    const subject = `Trademark report: ${report.domain.domain_name} \u2014 ${head.title}`;
    const html = buildReportEmailHtml(report, appUrl);

    const result = await sendMail({ to, subject, html });
    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.error || "Email failed" }), { status: 502 });
    }

    return new Response(JSON.stringify({ success: true, to }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to send report" }), { status: 500 });
  }
};
