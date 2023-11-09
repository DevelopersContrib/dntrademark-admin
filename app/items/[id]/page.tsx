import { Metadata } from 'next';
import ItemsDetails from '@/components/Items/ItemsDetails'
import {getItem} from '@/lib/data'
import { domainOwner } from "@/types/domainOwner";

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Item details',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async({ params }: { params: { id: number} }) => {
  const id = params.id
  const itemlist = await getItem(id);
  
  const tData = itemlist as domainOwner;
  
  
  return (
    <ItemsDetails tData={tData}/>
  )

  
}


export default page