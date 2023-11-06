import WithoutHits from "@/components/Domains/WithoutHits"
import {getDomainListWithOutHits} from '@/lib/data'

import { domainTable } from "@/types/domainTable";

const page = async() => {
  const domainlist = await getDomainListWithOutHits();
  
  const tData = domainlist as domainTable;

  return (
    <WithoutHits tData={tData} />
  )
}

export default page