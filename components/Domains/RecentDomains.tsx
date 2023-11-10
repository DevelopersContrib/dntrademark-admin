"use client";
import { domains } from "@/types/domains";
import Link from "next/link";
import { BsDatabaseCheck } from "react-icons/bs";
interface domainProps {
  domains: domains[];
}

const RecentDomains = ({ domains }: domainProps) => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col">
        <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
          Recent Domain Uploads
        </h4>

        {domains.map((item) => (
          <div
            key={item.id}
            className="flex w-full flex-col last:border-b border-t border-stroke dark:border-strokedark"
          >
            <div className="flex items-center p-2.5 xl:p-5">
              <div className=" mr-3 flex-shrink-0">
                <BsDatabaseCheck className="h-5 w-5" />
              </div>
              <p className="hidden font-medium text-black dark:text-white sm:block">
                {item.domain_name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecentDomains;
