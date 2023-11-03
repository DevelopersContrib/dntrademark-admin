import AllDomains from "@/components/Domains/AllDomains"
import {getDomainList} from '@/lib/data'

import { domainTable } from "@/types/domainTable";

const page = async() => {
  const domainlist = await getDomainList();
  
  const tData = domainlist as domainTable;

  return (
    <AllDomains tData={tData} />
  )
}

export default page