"use client";
import { FaBuffer } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { FaCircleNotch } from "react-icons/fa6";
import { useState, useEffect } from "react";
import {  getDomainItems } from "@/lib/domain-helper";
import { domainItems } from "@/types/domainItems";
import { items } from "@/types/items";
import LoadingRipple from "../Loading/LoadingRipple";

interface tableProps {
  tData: domainItems;
  id: number;
}

const WithItems = ({ tData,id }: tableProps) => {
  const [rows, setRows] = useState<items[]>(tData.data);
  const [tableData, setTableData] = useState<domainItems>(tData);
  const [loading, setLoading] = useState(false);

  const [orderBy, setOrderBy] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [reload, setReload] = useState<number>(1);
  const [listItems, setListItems] = useState<JSX.Element[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const domain_id = id
  
  const sort = (col:string) => {
      setSortBy(col)
      setOrderBy(orderBy==='ASC'?'DESC':'ASC')
     
  }

  const callReload = (del: boolean) => {
    const d = new Date();
    const time = d.getTime();
    setReload(time);
  
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    callReload(false);
  };

  const handleLimit = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    callReload(false);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
    callReload(false);
  };

  const handleNext = () => {
    if (page < tableData.last_page) setPage(page + 1);
    callReload(false);
  };

  
  useEffect(() => {
    const handlePage = (pageNo: number) => {
      setPage(pageNo);
      callReload(false);
    };
    const generateListItems = (t: domainItems) => {
      const items = [];
      for (let i = 1; i <= t.last_page; i++) {
        items.push(
          <li key={i}>
            <a
              onClick={() => handlePage(i)}
              className="flex items-center justify-center rounded py-1.5 px-3 font-medium hover:bg-primary hover:text-white"
              href="#"
            >
              {i}
            </a>
          </li>
        );
      }
      setListItems(items);
    };

    

    
    const getAllItems = async () => {
      setLoading(true);

      const res = await getDomainItems(domain_id,search, limit, page, sortBy, orderBy);
      //console.log('response'+res.items);
      const tData = res.items as domainItems;
      //console.log('tData '+tData.data)
      
      setTableData(tData);
      setRows(tData.data);
      setLoading(false);
      generateListItems(tData);
    };
    getAllItems();
    // eslint-disable-next-line
  }, [reload]);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Items</h3>
      </div>
     

      <div className="flex flex-col gap-5.5 p-6.5">
        <div className="max-w-full overflow-x-auto">
          <div className="w-full pb-4 border-b border-b-[#eee] flex justify-between mb-4">
            
            
          </div>

          <div className="w-full pb-4 flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div>
                <div className="relative">
                  <select
                    value={limit}
                   
                    className="border-form-stroke border-[#ddd] text-body-color focus:border-primary active:border-primary w-full appearance-none rounded-lg border-[1.5px] py-2 pl-4 pr-8 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2"></span>
                </div>
              </div>
              <div>
                records{" "}
                {/* {loading ? <FaCircleNotch className="w-4 h-4 fa-spin" /> : ""}{" "} */}
              </div>
            </div>
            <div className="space-x-2 flex items-center">
              <div>search:</div>
              <div>
                <input
                  value={search}
                 
                  type="text"
                  className="border-form-stroke border-[#ddd] text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-2 px-4 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]"
                />
              </div>
            </div>
          </div>

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                
                {/* Note:: Add class to "sorting" if sort "sorting_asc or sorting_desc" */}
                <th onClick={() => sort('keyword')} className={"min-w-[220px] table-th-header sorting "+(sortBy==='keyword'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                  Keyword
                </th>
                {/* Note:: Add class to "sorting" if sort "sorting_asc or sorting_desc" */}
                <th onClick={() => sort('date_last_crawled')} className={"min-w-[150px] table-th-header sorting "+(sortBy==='registration_number'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                  Registration Number
                </th>
                {/* Note:: Add class to "sorting" if sort "sorting_asc or sorting_desc" */}
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='serial_number'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Serial Number
                </th>
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='status_label'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Status Label
                </th>
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='status_date'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Status Date
                </th>
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='status_definition'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Status Definition
                </th>
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='filing_date'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Filing Date
                </th>
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='registration_date'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Registration Date
                </th>
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='abandonment_date'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Abandonment Date
                </th>
                <th onClick={() => sort('no_of_items')} className={"min-w-[120px] table-th-header sorting "+(sortBy==='expiration_date'?(orderBy==='ASC'?'sorting_asc':'sorting_desc'):'')}>
                 Expiration Date
                </th>
                <th className="table-th-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr>
                <td colSpan={6} align="center">
                  <div className="flex w-full items-center justify-center py-4 text-[#c5c5c5]">
                    <LoadingRipple />
                  </div>
                </td>
              </tr> : (
                <>
                  {rows.map((item) => (
                    <tr key={item.id}>
                     
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {item.keyword}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.registration_number}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                          {item.serial_number}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                          {item.status_label}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                          {item.status_date}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                          {item.status_definition}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                          {item.filing_date}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                          {item.registration_date}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">
                          {item.abandonment_date}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                          {item.expiration_date}
                        </p>
                      </td>


                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button className="hover:text-primary">
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                fill=""
                              ></path>
                              <path
                                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                fill=""
                              ></path>
                            </svg>
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )
              
              }
            </tbody>
          </table>
          <div className="flex w-full py-4 justify-between">
            <div className="font-medium text-[#666] dark:text-white">
              Showing {tableData?.from} to {tableData?.to} of{" "}
              {tableData?.total} entries
            </div>
            {tableData ? (
              <nav>
                <ul className="flex flex-wrap items-center gap-2">
                  <li>
                    <a
                      className="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                      onClick={() => handlePrevious()}
                    >
                      Previous
                    </a>
                  </li>
                  {listItems}
                  <li>
                    <a
                      onClick={() => handleNext()}
                      className="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                      href="#"
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithItems;
