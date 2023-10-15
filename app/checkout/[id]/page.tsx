import { Metadata } from 'next';
import StripeWrapper from '@/components/Checkout/StripeWrapper';
import { getPackage } from '@/lib/data';
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

interface Checkout {
  params: { id: string };
}

const App: React.FC<Checkout> = async ({ params  }) => {
  const pack = await getPackage(parseInt(params.id));
  if(pack===undefined){
    redirect('/')
  }else
    return (
        <StripeWrapper pack={pack} id={params.id} />
    );
};

export default App;