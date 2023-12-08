import { Metadata } from 'next';
import WithoutHits from "@/components/Domains/WithoutHits"
import {getDomainListWithOutHits} from '@/lib/data'
import { domainTable } from "@/types/domainTable";

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domains With Out Hits',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async() => {
  const domainlist = await getDomainListWithOutHits();
  
  const tData = domainlist as domainTable;
  // const invoices = await getInvoice();
  // const invoiceArr = invoices as []
  // const deleteDomain = invoiceArr === undefined || invoiceArr.length == 0;
  const deleteDomain = true;
  return (
    <WithoutHits tData={tData} deleteDomain={deleteDomain} />
  )
}

export default page