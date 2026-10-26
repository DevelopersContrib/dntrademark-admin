export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, queryOne } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
  typescript: true,
});

/**
 * Stripe webhook handler for dntrademark checkout.
 *
 * This route is the SOLE OWNER of plan granting. On payment_intent.succeeded
 * it sets users.package_id and inserts a paid invoice. Idempotent — safe for
 * Stripe retries and concurrent deliveries.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY        – existing
 *   STRIPE_WEBHOOK_SECRET    – signing secret from the Stripe dashboard webhook config
 */
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('[stripe-webhook] Signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const userId = Number(pi.metadata.dntrademark_user_id);
  const packageId = Number(pi.metadata.dntrademark_package_id);

  if (!userId || !Number.isFinite(userId) || !packageId || !Number.isFinite(packageId)) {
    console.warn('[stripe-webhook] payment_intent.succeeded missing dntrademark metadata, skipping:', pi.id);
    return;
  }

  const piTag = `pi:${pi.id}`;

  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();

    // Lock the user row to serialise concurrent webhook retries for the same user.
    const [userRows] = await conn.query(
      'SELECT id, package_id FROM users WHERE id = ? LIMIT 1 FOR UPDATE',
      [userId],
    );
    const user = (userRows as any[])[0];
    if (!user) {
      await conn.rollback();
      console.error('[stripe-webhook] User not found:', userId, 'PI:', pi.id);
      return;
    }

    // Idempotency: if an invoice already exists for this PI, skip.
    const [existingRows] = await conn.query(
      "SELECT id FROM invoices WHERE user_id = ? AND `desc` LIKE ? LIMIT 1",
      [userId, `%${piTag}%`],
    );
    if ((existingRows as any[]).length > 0) {
      await conn.rollback();
      console.info('[stripe-webhook] Already processed', piTag, '— idempotent skip');
      return;
    }

    const [pkgRows] = await conn.query(
      'SELECT id, price, name FROM packages WHERE id = ? LIMIT 1',
      [packageId],
    );
    const pkg = (pkgRows as any[])[0];
    if (!pkg) {
      await conn.rollback();
      console.error('[stripe-webhook] Package not found:', packageId, 'PI:', pi.id);
      return;
    }

    await conn.execute('UPDATE users SET package_id = ? WHERE id = ?', [packageId, userId]);

    const amountDollars = (pi.amount / 100).toFixed(2);
    await conn.execute(
      `INSERT INTO invoices
         (user_id, package_id, package_amount, additional_amount, total, status, \`desc\`, due_date, created_at, updated_at)
       VALUES (?, ?, ?, '0.00', ?, 'paid', ?, NOW(), NOW(), NOW())`,
      [userId, packageId, amountDollars, amountDollars, `${pkg.name} — ${piTag}`],
    );

    await conn.commit();

    console.info('[stripe-webhook] Granted package', packageId, 'to user', userId, '(' + piTag + ')');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  const userId = Number(pi.metadata.dntrademark_user_id);
  const packageId = Number(pi.metadata.dntrademark_package_id);

  if (!userId || !Number.isFinite(userId)) {
    console.warn('[stripe-webhook] payment_intent.payment_failed missing dntrademark metadata, skipping:', pi.id);
    return;
  }

  const failMsg = pi.last_payment_error?.message ?? 'Payment failed';
  console.warn(
    '[stripe-webhook] Payment failed for user', userId,
    'package', packageId,
    'PI:', pi.id,
    'reason:', failMsg,
  );

  if (packageId && Number.isFinite(packageId)) {
    const piTag = `pi:${pi.id}`;
    const existing = await queryOne<{ id: number }>(
      "SELECT id FROM invoices WHERE user_id = ? AND `desc` LIKE ? LIMIT 1",
      [userId, `%${piTag}%`],
    );
    if (existing) return;

    const pkg = await queryOne<{ name: string }>(
      'SELECT name FROM packages WHERE id = ? LIMIT 1',
      [packageId],
    );
    const pkgName = pkg?.name ?? `Package ${packageId}`;
    const amountDollars = (pi.amount / 100).toFixed(2);

    const conn = await db().getConnection();
    try {
      await conn.beginTransaction();

      const [dupeCheck] = await conn.query(
        "SELECT id FROM invoices WHERE user_id = ? AND `desc` LIKE ? LIMIT 1",
        [userId, `%${piTag}%`],
      );
      if ((dupeCheck as any[]).length > 0) {
        await conn.rollback();
        return;
      }

      await conn.execute(
        `INSERT INTO invoices
           (user_id, package_id, package_amount, additional_amount, total, status, \`desc\`, due_date, created_at, updated_at)
         VALUES (?, ?, ?, '0.00', ?, 'failed', ?, NOW(), NOW(), NOW())`,
        [userId, packageId, amountDollars, amountDollars, `${pkgName} — FAILED — ${piTag}`],
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}
