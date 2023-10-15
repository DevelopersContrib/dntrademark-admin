'use client'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import { StripePackage } from "@/types/stripe";

// Docs:: https://stripe.com/docs/payments/accept-a-payment-charges?client=react

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);
const StripeWrapper: React.FC<StripePackage> = ({ id, pack }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm pack={pack} />
    </Elements>
  );
};

export default StripeWrapper;