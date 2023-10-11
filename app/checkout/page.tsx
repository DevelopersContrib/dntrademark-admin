import { Metadata } from 'next';
import StripeWrapper from '@/components/Checkout/StripeWrapper';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

export default function App() {
  return (
      <StripeWrapper />
  );
};