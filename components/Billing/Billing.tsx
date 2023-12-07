import Link from "next/link";
import React from "react";

export default function Billing() {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            My Invoices
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          {/* Start:: Notification if Successfully deleted */}
          <div className="mb-4 hidden">
            <div className="flex w-full rounded-lg border-l-[6px] border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md md:p-9">
              <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                    fill="white"
                    stroke="white"
                  ></path>
                </svg>
              </div>
              <div className="w-full">
                <h5 className="mb-3 text-lg font-semibold text-dark">
                  {"Deleted Successfully"}
                </h5>
              </div>
            </div>
          </div>
          {/* End:: Notification if Successfully deleted */}

          {/* Start:: Table Form */}
          <div className="w-full pb-4 flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div>
                <div className="relative">
                  <select className="border-form-stroke border-[#ddd] text-body-color focus:border-primary active:border-primary w-full appearance-none rounded-lg border-[1.5px] py-2 pl-4 pr-8 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2"></span>
                </div>
              </div>
              <div>
                <div>
                  records{" "}
                  {/* {loading ? <FaCircleNotch className="w-4 h-4 fa-spin" /> : ""}{" "} */}
                </div>
              </div>
            </div>
            <div className="space-x-2 flex items-center">
              <div>search:</div>
              <div>
                <input
                  type="text"
                  className="border-form-stroke border-[#ddd] text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-2 px-4 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]"
                />
              </div>
            </div>
          </div>
          {/* End:: Table Form */}

          {/* Start:: Table */}
          <div className="w-full table-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] table-th-header sorting sorting_desc">
                    Plan
                  </th>
                  <th className="min-w-[150px] table-th-header sorting ">
                    Amount
                  </th>
                  <th className="min-w-[120px] table-th-header sorting ">
                    Additional
                  </th>
                  <th className="min-w-[120px] table-th-header sorting ">
                    Status
                  </th>
                  <th className="min-w-[120px] table-th-header sorting ">
                    Date
                  </th>
                  <th className="table-th-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      Basic Free
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      $99.00
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      $0.10
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">
                      Due
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">
                      Dec. 17, 2023
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="space-x-2">
                      <a
                        href=""
                        className="inline-flex items-center justify-center rounded border bg-strokedark text-white border-strokedark px-4 py-1 hover:opacity-70"
                      >
                        View Details
                      </a>
                      <a
                        href=""
                        className="inline-flex items-center justify-center rounded border bg-meta-1 text-white border-meta-1 hover:opacity-70 px-4 py-1"
                      >
                        Pay
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* End:: Table */}

          {/* Start:: Table Footer */}
          <div className="flex w-full py-4 justify-between items-center">
            <div className="font-medium text-[#666] dark:text-white">
              Showing 1 to 100 of 5 entries
            </div>
            <nav>
              <ul className="flex flex-wrap items-center gap-2">
                <li>
                  <a className="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white">
                    Previous
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center rounded py-1.5 px-3 font-medium hover:bg-primary hover:text-white"
                    href="#"
                  >
                    1
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center rounded py-1.5 px-3 font-medium hover:bg-primary hover:text-white"
                    href="#"
                  >
                    2
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                    href="#"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          {/* End:: Table Footer */}
        </div>
      </div>
    </>
  );
}
