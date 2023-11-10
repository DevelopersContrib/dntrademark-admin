"use client";
import { domains } from "@/types/domains";
import Link from "next/link";
interface domainProps {
  domains: domains[];
}

const RecentDomains = ({ domains }: domainProps) => {
  return (
    <>
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-bold text-black dark:text-white">Recent Domain Uploads</h4>
          
            {
              domains.map((item)=>(
                <div key={item.id} className="grid grid-cols-2 border-b border-t border-stroke dark:border-strokedark sm:grid-cols-4">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                        <div className="h-8 w-8 max-w-8 flex-shrink-0">
                        <svg className="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17a5 5 0 01-.916-9.916 5.002 5.002 0 019.832 0A5.002 5.002 0 0116 17m-7-5l3-3m0 0l3 3m-3-3v12"/>
                        </svg>

                        </div>
                        <p className="hidden font-medium text-black dark:text-white sm:block">
                        {item.domain_name}
                        </p>
                  </div>      
                  
                </div>
              ))
            }
         
        </div>
    </>
  )
}

export default RecentDomains