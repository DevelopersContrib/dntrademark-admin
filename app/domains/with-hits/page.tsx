import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import WithHits from "@/components/Domains/WithHits"
import Unauthenticated from '@/components/Unauthenticated';
import {getDomainListWithHits,getInvoice} from '@/lib/data'
import { resolveDomainList } from '@/lib/domain-page';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domains With Hits',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

const page = async() => {
  const domainlist = await getDomainListWithHits();
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
    <WithHits tData={resolved} deleteDomain={deleteDomain} />
  )
}

export default page;
