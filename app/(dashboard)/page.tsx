import { Metadata } from 'next';
import ECommerce from '@/components/Dashboard/E-commerce';
import { getDomainStats, getUserPackage, getUserPlan } from '@/lib/data';
import { redirect } from "next/navigation"
import {getDomainList,getFeed,getGraph} from '@/lib/data'
import { domainTable } from "@/types/domainTable";
import { graph } from "@/types/graph";
import { Stat } from "@/types/stats";

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

export default async function Home() {
  // Run every independent fetch in parallel instead of sequentially.
  const [feed, domainlist, recentList, stats, usepack, plan, graph] = await Promise.all([
    getFeed(),
    getDomainList(5),
    getDomainList(5, 1, 'id', 'DESC'),
    getDomainStats(),
    getUserPackage(),
    getUserPlan(),
    getGraph(),
  ]);

  const blogFeed = feed as string;

  if (!domainlist) {
    redirect('/auth/signin');
  }

  const tData = domainlist as unknown as domainTable;
  const recent = recentList as unknown as domainTable;
  const graphData = (graph ?? []) as graph[];
  const statData: Stat =
    stats ?? {
      domainsCount: 0,
      hitsCount: 0,
      noHitsCount: 0,
      domainsAtRiskCount: 0,
      investorSpaceCount: 0,
    };

  const packageId = usepack?.package_id ?? null;
  const isOnboarding = parseInt(String(usepack?.is_onboarding ?? "0"), 10);

  if (packageId === null) {
    redirect('/pricing');
  } else if (isOnboarding === 0) {
    redirect('/onboarding');
  } else {
    return (
      <>
        <ECommerce tData={tData} stats={statData} recent={recent} feed={blogFeed} graph={graphData} plan={plan} />
      </>
    );
  }

}
