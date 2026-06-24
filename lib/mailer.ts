/**
 * Server-only email sender backed by the Amazon SES SMTP interface.
 *
 * Reads the MAIL_* credentials from the environment (the SES SMTP endpoint +
 * IAM SMTP username/password already provisioned in .env). Never import this
 * into client code — it would leak the SMTP password into the bundle.
 */
import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT) || 587;
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("Mailer is not configured: missing MAIL_HOST/MAIL_USERNAME/MAIL_PASSWORD");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    // 465 = implicit TLS, anything else (587) = STARTTLS.
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export interface SendMailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendMailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

/** Strip HTML tags to build a plain-text fallback when none is supplied. */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|br|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const fromAddress = () => {
  const name = process.env.MAIL_FROM_NAME || "DNTrademark";
  const email = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME || "no-reply@dntrademark.com";
  return `"${name}" <${email}>`;
};

/** Send a single email (one envelope, possibly many recipients). */
export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  try {
    const info = await getTransporter().sendMail({
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text || htmlToText(input.html),
      replyTo: input.replyTo,
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[mailer] sendMail failed:", message);
    return { ok: false, error: message };
  }
}

export interface BulkResult {
  sent: number;
  failed: number;
  errors: string[];
}

/**
 * Send the same message individually to a list of recipients. Individual sends
 * (rather than one big BCC) keep one bad address from sinking the whole batch
 * and let SES apply per-recipient suppression. Sends are lightly throttled.
 */
export async function sendBulk(
  recipients: string[],
  subject: string,
  html: string,
  opts: { replyTo?: string; perEmailDelayMs?: number } = {},
): Promise<BulkResult> {
  const result: BulkResult = { sent: 0, failed: 0, errors: [] };
  const clean = Array.from(
    new Set(
      (recipients || [])
        .map((r) => String(r || "").trim().toLowerCase())
        .filter((r) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r)),
    ),
  );

  const text = htmlToText(html);
  for (const to of clean) {
    const res = await sendMail({ to, subject, html, text, replyTo: opts.replyTo });
    if (res.ok) {
      result.sent += 1;
    } else {
      result.failed += 1;
      result.errors.push(`${to}: ${res.error}`);
    }
    if (opts.perEmailDelayMs && opts.perEmailDelayMs > 0) {
      await new Promise((r) => setTimeout(r, opts.perEmailDelayMs));
    }
  }
  return result;
}

/** Verify the SMTP connection/credentials without sending mail. */
export async function verifyMailer(): Promise<SendMailResult> {
  try {
    await getTransporter().verify();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}
