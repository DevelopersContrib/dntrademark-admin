import { Metadata } from 'next';
import Testcomponent from "@/components/Domains/Testcomponent"

export const metadata: Metadata = {
  title: 'DNTrademark Admin - All Domains',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async() => {
  return (
    <Testcomponent />
  )
}

export default page