import { Metadata } from 'next';
import {getItemProtests,getItem} from '@/lib/data'
import { items } from "@/types/items";
import { protest } from "@/types/protest";
import { protestTable } from "@/types/protestTable";
import {getItemProtestList} from '@/lib/data'
import ProtestList from "@/components/Protest/ProtestList"
import { template } from "@/lib/template";
export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Items',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async({ params }: { params: { id: number} }) => {
  const file = template;
   const id = params.id

  const item = await getItem(id);
  const items  = item as items;

  const itemProtests = await getItemProtestList(id);
  const protests  = itemProtests as protestTable
  return (
    <ProtestList domainItems={item} id={params.id} template={file} tData={protests} />
  )

  
}

export default page