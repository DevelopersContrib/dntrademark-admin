export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPackage } from '@/lib/data';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
  typescript: true,
});

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(options);
    const body = await req.json();
    const tokenId: string | undefined = body.token;
    const packId = parseInt(body.pack_id);

    if (!tokenId) {
      return NextResponse.json({ success: false, error: 'Missing card token' }, { status: 400 });
    }

    const pack = await getPackage(packId);
    if (!pack) {
      return NextResponse.json({ success: false, error: 'Invalid package' }, { status: 400 });
    }

    const amount = Math.round(pack.price * 100);

    const pm = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: tokenId },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      payment_method: pm.id,
      confirm: true,
      metadata: {
        dntrademark_user_id: String(session?.id ?? ''),
        dntrademark_package_id: String(pack.id),
        dntrademark_email: session?.user?.email ?? '',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, error: 'Payment requires additional action or was not completed.' },
        { status: 200 },
      );
    }

    // Notify Laravel (fire-and-forget — plan granting is handled by the webhook)
    const apiUrl = process.env.API_URL + '/payment/charge?api_key=' + process.env.API_KEY;
    axios
      .post(
        apiUrl,
        {
          package_id: pack.id,
          email: session?.user?.email,
          amount,
          price: pack.price,
          client_secret: paymentIntent.client_secret,
          return_url: process.env.BASE_URL + '/pricing',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session?.token,
          },
          timeout: 10000,
        },
      )
      .catch((err: unknown) => {
        console.warn('[chargeinvoice] Laravel notification failed (non-critical):', err instanceof Error ? err.message : err);
      });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    const msg = error?.raw?.message ?? error?.message ?? 'Payment failed';
    console.error('[chargeinvoice] Error:', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 200 });
  }
};
