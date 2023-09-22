import { Metadata } from 'next';

import ECommerce from '@/components/Dashboard/E-commerce';
import Loader from '@/components/common/Loader';

export const metadata: Metadata = {
  title: 'TailAdmin | Next.js E-commerce Dashboard Template',
  description: 'This is Home Blog page for TailAdmin Next.js',
  // other metadata
};

export default function Home() {
  return (
    <>
      {/* <Loader /> */}
      <ECommerce />
    </>
  );
}
