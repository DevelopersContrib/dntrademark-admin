import AllDomains from "@/components/Domains/AllDomains"
import {getDomainList} from '@/lib/data'

// import { domains } from "@/types/domains";
import { domainTable } from "@/types/domainTable";

const page = async() => {
  const domainlist = await getDomainList();
  
  const tData = domainlist as domainTable;
  console.log('tData',tData)
  return (
    <AllDomains tData={tData} />
  )
}

export default page