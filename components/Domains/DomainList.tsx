"use client";
import { domains } from "@/types/domains";
import Link from "next/link";
import { BiSearchAlt } from "react-icons/bi";
import { BsGlobe } from "react-icons/bs";
interface domainProps {
  domains: domains[];
}

const DomainList = ({ domains }: domainProps) => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col">
        <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
          Domain Lists
        </h4>

        {domains.map((item) => (
          <div
            key={item.id}
            className="flex w-full flex-col last:border-b border-t border-stroke dark:border-strokedark"
          >
            <div className="flex items-center p-2.5 xl:p-5">
              <div className="mr-3 flex-shrink-0">
                <BsGlobe className="h-5 w-5" />
              </div>
              <p className="font-medium text-black dark:text-white">
                <Link href="/domains/all">{item.domain_name}</Link>
              </p>
            </div>
          </div>
        ))}

        {domains.length > 4 ? (
          <div className="flex w-full flex-col last:border-b border-t border-stroke dark:border-strokedark">
            <div className="flex items-center p-5">
              <div className="mr-3 flex-shrink-0">
                <BsGlobe className="h-5 w-5" />
              </div>

              <p className="font-medium text-black dark:text-white">
                <Link href="/domains/all">View All</Link>
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default DomainList;
