import { Metadata } from 'next';
import ECommerce from '@/components/Dashboard/E-commerce';
import { getDomainStats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

export default async function Home() {
  const stats = await getDomainStats();
  // const stats= {
	// 	domainsCount:0,
	// 	hitsCount: 0,
  //   noHitsCount:0,
  //   domainsAtRiskCount:0
  // };
  return (
    <>
      <ECommerce stats={stats} />
    </>
  );
}
