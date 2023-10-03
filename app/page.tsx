import { Metadata } from 'next';
import ECommerce from '@/components/Dashboard/E-commerce';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

export default function Home() {
  return (
    <>
      <ECommerce />
    </>
  );
}
