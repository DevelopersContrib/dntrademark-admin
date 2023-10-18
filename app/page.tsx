import { Metadata } from 'next';
import ECommerce from '@/components/Dashboard/E-commerce';
import { getDomainStats, getUserPackage } from '@/lib/data';
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

export default async function Home() {
  const stats = await getDomainStats();
  const usepack = await getUserPackage();
  console.log(usepack.package_id);
  console.log(usepack.is_onboarding);
  if(usepack?.package_id===null){
    redirect('/pricing');
  }else if(usepack?.package_id!==null && parseInt(usepack.is_onboarding) === 0){
    redirect('/onboarding');
  } else{
    return (
      <>
        <ECommerce stats={stats} />
      </>
    );
  }
  
}
