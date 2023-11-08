import { Metadata } from 'next';
import WithItems from "@/components/Domains/WithItems"
import {getDomainItems} from '@/lib/data'
import { domainItems } from "@/types/domainItems";

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Ites',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async({ params }: { params: { id: number} }) => {
  const id = params.id
  const itemlist = await getDomainItems(id);
  
  const tData = itemlist as domainItems;
  
  
  return (
    <WithItems tData={tData} id={params.id}/>
  )

  
}

export default page