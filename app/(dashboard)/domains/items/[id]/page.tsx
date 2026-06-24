import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import WithItems from "@/components/Domains/WithItems"
import Unauthenticated from '@/components/Unauthenticated';
import {getDomainItems} from '@/lib/data'
import { resolveDomainItems } from '@/lib/domain-page';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Items',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

const page = async({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id, 10);
  const itemlist = await getDomainItems(id);
  const resolved = resolveDomainItems(itemlist);

  if (resolved === 'unauthenticated') {
    return <Unauthenticated />;
  }

  if (resolved === null) {
    redirect('/auth/signin');
  }

  return (
    <WithItems tData={resolved} id={id}/>
  )
}

export default page
