import React from "react";

const ItemsDetails = () => {
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
            <li className="font-medium text-primary">Item Details</li>
          </ol>
        </nav>
      </div>
      <div className="flex flex-col gap-8">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 xl:px-7.5">
            <h3 className="font-medium text-black dark:text-white">
              Item Details
            </h3>
          </div>
          <div className="p-4 sm:p-6 xl:p-10">
            <table className="w-full table-auto table-border-boxed ">
              <tbody>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Status Defination:
                  </td>
                  <td className="">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis atque, dolorum aperiam assumenda quas voluptates.
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Filing Date:
                  </td>
                  <td className="">
                    2020-11-30
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Registration:
                  </td>
                  <td className="">
                    
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Abandonment Date:
                  </td>
                  <td className="">
                    
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Description:
                  </td>
                  <td className="">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ipsam aperiam assumenda mollitia est nam ad minima iusto? Perspiciatis aliquam architecto earum ratione eveniet excepturi asperiores deserunt minus praesentium repudiandae.
                  </td>
                </tr>
                <tr>
                  <td className=" font-semibold" width={200}>
                    Last Date Crawled
                  </td>
                  <td className="">
                    2023-11-30 01:00:02
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
              <tbody>
                <tr>
                  <td>
                    STORED ENERGY, INC.
                  </td>
                  <td>
                    Owner at Publication Corporation
                  </td>
                  <td>
                    HENDERSON NV US 89011
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
