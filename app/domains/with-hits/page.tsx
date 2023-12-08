import { Metadata } from 'next';
import WithHits from "@/components/Domains/WithHits"
import {getDomainListWithHits,getInvoice} from '@/lib/data'
import { domainTable } from "@/types/domainTable";

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domains With Hits',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async() => {
  const domainlist = await getDomainListWithHits();
  
  const tData = domainlist as domainTable;
  const invoices = await getInvoice();
  const invoiceArr = invoices as []
  const deleteDomain = invoiceArr === undefined || invoiceArr.length == 0;
  return (
    <WithHits tData={tData} deleteDomain={deleteDomain} />
  )
}

export default page