import { Metadata } from 'next';
import {getItemProtests,getItem} from '@/lib/data'
import { items } from "@/types/items";
import { protest } from "@/types/protest";
import { protestTable } from "@/types/protestTable";
import {getItemProtestList} from '@/lib/data'
import ProtestList from "@/components/Protest/ProtestList"
import { promises as fs } from 'fs';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Items',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async({ params }: { params: { id: number} }) => {
  const file = await fs.readFile(process.cwd() + '/app/data/trademark_template.txt', 'utf8');
  // console.log('file',file)
  const id = params.id
  // const itemlist = await getDomainItems(id);
  
  // const tData = itemlist as domainItems;
    
  const item = await getItem(id);
  const items  = item as items;

  const itemProtests = await getItemProtestList(id);
  const protests  = itemProtests as protestTable
  return (
    <ProtestList domainItems={item} id={params.id} template={file} tData={protests} />
  )

  
}

export default page