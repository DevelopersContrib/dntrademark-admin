import { Metadata } from 'next';
import ECommerce from '@/components/Dashboard/E-commerce';
import { getDomainStats, getUserPackage } from '@/lib/data';
import { redirect } from "next/navigation"
import {getDomainList,getFeed,getGraph} from '@/lib/data'
import { domainTable } from "@/types/domainTable";
import { graph } from "@/types/graph";
import Unauthenticated from '@/components/Unauthenticated';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

export default async function Home() {
  const feed = await getFeed(); 
  const blogFeed = feed as string;
  const domainlist = await getDomainList(5); 
  
  if (domainlist === 'Unauthenticated.') {
    return (
      <Unauthenticated />
    );
  } else if (domainlist === undefined) {
    redirect('/auth/signin');
  }

  const tData = domainlist as domainTable;
  
  const recentList = await getDomainList(5,1,'id','DESC');  
  const recent = recentList as domainTable;
  
  const stats = await getDomainStats();
  const usepack = await getUserPackage();

  const graph = await getGraph();
  const graphData = graph as graph[];

  if(usepack?.package_id===null){
    redirect('/pricing');
  }else if(usepack?.package_id!==null && parseInt(usepack?.is_onboarding) === 0){
    redirect('/onboarding');
  } else {
    return (
      <>
        <ECommerce tData={tData} stats={stats} recent={recent} feed={blogFeed} graph={graphData} />
      </>
    );
  }
  
}
