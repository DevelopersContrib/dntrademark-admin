"use client";
import React from "react";
import { useState, useEffect } from "react";
import {  getDomainItems } from "@/lib/domain-helper";
import { domainOwner } from "@/types/domainOwner";
import { items } from "@/types/items";
import { domains } from "@/types/domains";

interface tableProps {
  tData: domainOwner;
}

const ItemsDetails = ({ tData }: tableProps) => {
  const [row, setRows] = useState<items>(tData.item);
  const [owner, setOwner] = useState<domainOwner>(tData);
  const [domain, setDomain] = useState<domains>(tData.item.domain);

 
  useEffect(() => {
    (async () => {
      setRows(tData.item);
      setOwner(tData);
      setDomain(tData.item.domain);

    })();
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Item Details
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/">
                Dashboard /
              </a>
            </li>
            <li>
              <a className="font-medium" href={'/domains/items/'+row.domain_id}>
                {domain.domain_name} Items /
              </a>
            </li>
            <li className="font-medium text-primary">Item Details</li>
          </ol>
        </nav>
      </div>
      <div className="flex flex-col gap-8">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 xl:px-7.5">
            <h3 className="font-medium text-black dark:text-white">
            Item Details - Serial Number {row.serial_number}
            </h3>
          </div>
          <div className="p-4 sm:p-6 xl:p-10">
            <table className="w-full table-auto table-border-boxed ">
              <tbody>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Keyword:
                  </td>
                  <td className="">
                    {row.keyword}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Registration Number:
                  </td>
                  <td className="">
                    {row.registration_number}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Serial Number:
                  </td>
                  <td className="">
                    {row.serial_number}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Status Label:
                  </td>
                  <td className="">
                    {row.status_label}
                  </td>
                </tr>

                <tr>
                  <td className=" font-semibold" width={200}>
                    Status Date:
                  </td>
                  <td className="">
                    {row.status_date}
                  </td>
                </tr>

                <tr>
                  <td className=" font-semibold" width={200}>
                    Status Definition:
                  </td>
                  <td className="">
                    {row.status_definition}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Filing Date:
                  </td>
                  <td className="">
                    {row.filing_date}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Registration Date:
                  </td>
                  <td className="">
                    {row.registration_date}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Abandonment Date:
                  </td>
                  <td className="">
                    {row.abandonment_date}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Expiration Date:
                  </td>
                  <td className="">
                    {row.expiration_date}
                  </td>
                </tr>

                <tr>
                  <td className=" font-semibold" width={200}>
                    Description:
                  </td>
                  <td className="">
                    {row.description}
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Last Date Crawled
                  </td>
                  <td className="">
                    {row.updated_at}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 xl:px-7.5">
            <h3 className="font-medium text-black dark:text-white">
              Owner Details
            </h3>
          </div>
          <div className="p-4 sm:p-6 xl:p-10">
            <table className="w-full table-auto table-border-boxed">
              <thead className="min-w-[20px] table-th-header">
                <th>Name</th>
                <th>Label</th>
                <th>Legal Entity</th>
                <th>Address</th>
              </thead>
              <tbody>
                <tr>
                  <td>
                   {owner.name}
                  </td>
                  <td>
                  {owner.owner_label}
                  </td>
                  <td>
                    {owner.legal_entity_type}
                  </td>
                  <td>
                    {owner.address1}, {owner.city}, {owner.state}, , {owner.country}, , {owner.postcode}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemsDetails;