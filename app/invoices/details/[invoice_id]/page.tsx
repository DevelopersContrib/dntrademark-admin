import { Metadata } from 'next';
import StripeWrapper from '@/components/Invoice/StripeWrapper';
import { getInvoiceDetails } from '@/lib/data';
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Global Trademark Notification Platform',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

interface Invoice {
  params: { invoice_id: string };
}

const App: React.FC<Invoice> = async ({ params  }) => {
 
  const pack = await getInvoiceDetails(parseInt(params.invoice_id))
 
  if(pack===undefined){
    redirect('/')
  }else
    return (
      <StripeWrapper pack={pack} id={params.invoice_id} />
    );
};

export default App;