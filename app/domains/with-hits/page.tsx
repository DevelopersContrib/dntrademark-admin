import WithHits from "@/components/Domains/WithHits"
import {getDomainListWithHits} from '@/lib/data'

import { domainTable } from "@/types/domainTable";

const page = async() => {
  const domainlist = await getDomainListWithHits();
  
  const tData = domainlist as domainTable;

  return (
    <WithHits tData={tData} />
  )
}

export default page