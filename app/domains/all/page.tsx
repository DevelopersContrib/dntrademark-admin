import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AllDomains from "@/components/Domains/AllDomains"
import Unauthenticated from '@/components/Unauthenticated';
import {getDomainList,getInvoice} from '@/lib/data'
import { resolveDomainList } from '@/lib/domain-page';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - All Domains',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

const page = async() => {
  const domainlist = await getDomainList();
  const resolved = resolveDomainList(domainlist);

  if (resolved === 'unauthenticated') {
    return <Unauthenticated />;
  }

  if (resolved === null) {
    redirect('/auth/signin');
  }

  const invoices = await getInvoice();
  const invoiceArr = (invoices ?? []) as [];
  const deleteDomain = invoiceArr.length === 0;

  return (
    <AllDomains tData={resolved} deleteDomain={deleteDomain}  />
  )
}

export default page;
