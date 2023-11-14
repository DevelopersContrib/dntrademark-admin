import { Metadata } from 'next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Tabmenu from '@/components/Settings/Tabmenu';

import { getUser } from '@/lib/data';



export const metadata: Metadata = {
  title: 'DNTrademark Admin - Account Settings',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
 
};

export default async function Profile() {
  
  
  const userdetails = await getUser();
  
  return (
    <>
      <Breadcrumb pageName="Account Settings" />
      <Tabmenu  userdetails={userdetails} />

    </>
  );
}

