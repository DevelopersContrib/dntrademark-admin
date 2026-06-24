import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DomainMonitor from '@/components/Monitoring/DomainMonitor';
import {
  getSessionUserId,
  listMonitorDomains,
  getMonitorSummary,
  getUserPlan,
} from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Monitoring',
  description:
    'Monitor your domains against the USPTO trademark database and get alerted to potential conflicts.',
};

const page = async () => {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect('/auth/signin');
  }

  const [initialDomains, initialSummary, initialPlan] = await Promise.all([
    listMonitorDomains(userId),
    getMonitorSummary(userId),
    getUserPlan(userId),
  ]);

  return (
    <DomainMonitor
      initialDomains={initialDomains}
      initialSummary={initialSummary}
      initialPlan={initialPlan}
    />
  );
};

export default page;
