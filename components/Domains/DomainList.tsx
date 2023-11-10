"use client";
import { domains } from "@/types/domains";
import Link from "next/link";
interface domainProps {
  domains: domains[];
}

const DomainList = ({ domains }: domainProps) => {
  return (
    <>
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-bold text-black dark:text-white">Domain Lists</h4>
          
            {
              domains.map((item)=>(
                <div key={item.id} className="grid grid-cols-2 border-b border-t border-stroke dark:border-strokedark sm:grid-cols-4">
                 <div className="flex items-center gap-3 p-2.5 xl:p-5">
                        <div className="h-8 w-full max-w-8 flex-shrink-0">
                        <svg className="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>

                        </div>
                        <p className="hidden font-medium text-black dark:text-white sm:block">
                        <Link href="/domains/all">{item.domain_name}</Link>
                        </p>
                  </div>
                  
                
                </div> 
              ))
            }
            {
              domains.length>4?(
                <div className="grid grid-cols-2 border-b border-t border-stroke dark:border-strokedark sm:grid-cols-4">
                   <div className="h-8 w-full max-w-8 flex-shrink-0">
                        <svg className="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>

                        </div>
                
                  <Link href="/domains/all">View All</Link>
                </div>
              ):''
            }
         
        </div>
    </>
  )
}

export default DomainList