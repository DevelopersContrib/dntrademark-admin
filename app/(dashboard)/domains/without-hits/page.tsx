import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import WithoutHits from "@/components/Domains/WithoutHits"
import Unauthenticated from '@/components/Unauthenticated';
import {getDomainListWithOutHits,getInvoice} from '@/lib/data'
import { resolveDomainList } from '@/lib/domain-page';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domains With Out Hits',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

const page = async() => {
  const domainlist = await getDomainListWithOutHits();
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
    <WithoutHits tData={resolved} deleteDomain={deleteDomain} />
  )
}

export default page;
