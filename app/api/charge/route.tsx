//https://sultanoveli.medium.com/how-to-add-stripe-payments-to-your-next-js-app-d1cfced7c8a5
import { NextResponse, NextRequest } from "next/server";
import Stripe from 'stripe';
import { getPackage } from '@/lib/data';
import { options } from '@/lib/options';
import { getServerSession } from "next-auth/next"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
  typescript: true
});

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(options)

    const data = await req.json();
    const pack = await getPackage(parseInt(data.pack_id));
    const amount = Math.round(pack.price*100); 
   
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "USD",
        });

        const data = {
            email: session?.user?.email,
            amount: amount,
            prince:pack.price,
            client_secret:paymentIntent.client_secret
        }
        // call payment api... 


        return NextResponse.json({ token: paymentIntent.client_secret }, { status: 200 });
    } catch (error: any) {
        return new NextResponse(error, {
        status: 400,
        });
    }
  } catch (error) {
    console.log(error);
  }
};
