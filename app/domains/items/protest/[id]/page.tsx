import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {getItemProtestList,getItem} from '@/lib/data'
import Unauthenticated from '@/components/Unauthenticated';
import ProtestList from "@/components/Protest/ProtestList"
import { template } from "@/lib/template";
import { resolveProtestTable } from '@/lib/domain-page';
import { items } from "@/types/items";

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Items',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

const page = async({ params }: { params: { id: string } }) => {
  const file = template;
  const id = parseInt(params.id, 10);

  const item = await getItem(id);
  if (item === 'Unauthenticated.') {
    return <Unauthenticated />;
  }

  if (!item) {
    redirect('/auth/signin');
  }

  const itemProtests = await getItemProtestList(id);
  const resolved = resolveProtestTable(itemProtests);

  if (resolved === 'unauthenticated') {
    return <Unauthenticated />;
  }

  if (resolved === null) {
    redirect('/auth/signin');
  }

  return (
    <ProtestList domainItems={item as items} id={id} template={file} tData={resolved} />
  )
}

export default page
