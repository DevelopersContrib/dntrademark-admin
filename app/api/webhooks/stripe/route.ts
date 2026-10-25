export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { queryOne, execute } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
  typescript: true,
});

/**
 * Stripe webhook handler for dntrademark checkout.
 *
 * Owns plan granting: on payment_intent.succeeded it sets users.package_id
 * and records a paid invoice. Idempotent — safe for Stripe retries.
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
    console.warn('[stripe-webhook] payment_intent.succeeded missing metadata, skipping:', pi.id);
    return;
  }

  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM invoices WHERE user_id = ? AND status = 'paid' AND `desc` LIKE ? LIMIT 1",
    [userId, `%pi:${pi.id}%`],
  );
  if (existing) {
    console.info('[stripe-webhook] Already processed PI', pi.id, '— idempotent skip');
    return;
  }

  const user = await queryOne<{ id: number; package_id: number | null }>(
    'SELECT id, package_id FROM users WHERE id = ? LIMIT 1',
    [userId],
  );
  if (!user) {
    console.error('[stripe-webhook] User not found:', userId, 'PI:', pi.id);
    return;
  }

  const pkg = await queryOne<{ id: number; price: string | number; name: string }>(
    'SELECT id, price, name FROM packages WHERE id = ? LIMIT 1',
    [packageId],
  );
  if (!pkg) {
    console.error('[stripe-webhook] Package not found:', packageId, 'PI:', pi.id);
    return;
  }

  await execute('UPDATE users SET package_id = ? WHERE id = ?', [packageId, userId]);

  const amountDollars = (pi.amount / 100).toFixed(2);
  await execute(
    `INSERT INTO invoices
       (user_id, package_id, package_amount, additional_amount, total, status, \`desc\`, due_date, created_at, updated_at)
     VALUES (?, ?, ?, '0.00', ?, 'paid', ?, NOW(), NOW(), NOW())`,
    [userId, packageId, amountDollars, amountDollars, `${pkg.name} — pi:${pi.id}`],
  );

  console.info(
    '[stripe-webhook] Granted package', packageId, 'to user', userId,
    '(PI:', pi.id, ')',
  );
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  const userId = Number(pi.metadata.dntrademark_user_id);
  const packageId = Number(pi.metadata.dntrademark_package_id);

  if (!userId || !Number.isFinite(userId)) {
    console.warn('[stripe-webhook] payment_intent.payment_failed missing metadata, skipping:', pi.id);
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
    const pkg = await queryOne<{ name: string }>(
      'SELECT name FROM packages WHERE id = ? LIMIT 1',
      [packageId],
    );
    const pkgName = pkg?.name ?? `Package ${packageId}`;
    const amountDollars = (pi.amount / 100).toFixed(2);

    const existing = await queryOne<{ id: number }>(
      "SELECT id FROM invoices WHERE user_id = ? AND `desc` LIKE ? LIMIT 1",
      [userId, `%pi:${pi.id}%`],
    );
    if (!existing) {
      await execute(
        `INSERT INTO invoices
           (user_id, package_id, package_amount, additional_amount, total, status, \`desc\`, due_date, created_at, updated_at)
         VALUES (?, ?, ?, '0.00', ?, 'failed', ?, NOW(), NOW(), NOW())`,
        [userId, packageId, amountDollars, amountDollars, `${pkgName} — FAILED — pi:${pi.id}`],
      );
    }
  }
}
