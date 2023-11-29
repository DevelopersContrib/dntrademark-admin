import { Metadata } from 'next';
// import WithItems from "@/components/Domains/WithItems"
import {getDomainItems,getItem} from '@/lib/data'
import { items } from "@/types/items";
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
    
  const domainItems = await getItem(id);
  // console.log('items',domainItems)
  const items  = domainItems as items;
  // console.log('items',items)
  return (
    // <WithItems tData={tData} id={params.id}/>
    <ProtestList domainItems={items} id={params.id} template={file} />
  )

  
}

export default page