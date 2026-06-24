import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ItemsDetails from '@/components/Items/ItemsDetails'
import Unauthenticated from '@/components/Unauthenticated';
import {getItem} from '@/lib/data'
import { items } from "@/types/items";

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Item details',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

const page = async({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id, 10);
  const itemlist = await getItem(id);

  if (itemlist === 'Unauthenticated.') {
    return <Unauthenticated />;
  }

  if (!itemlist) {
    redirect('/auth/signin');
  }

  return (
    <ItemsDetails tData={itemlist as items}/>
  )
}

export default page
