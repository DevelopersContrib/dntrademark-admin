'use client';
import { FaBuffer } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { FaCircleNotch } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { getDomains, deleteDomains} from '@/lib/domain-helper';
import { domainTable } from "@/types/domainTable";
import { domains } from "@/types/domains";

interface tableProps {
  tData: domainTable;
}

  const AllDomains = ({ tData }: tableProps) =>{
  const [rows, setRows] = useState<domains[]>(tData.data);
  const [tableData, setTableData] = useState<domainTable>(tData);
  const [loading, setLoading] = useState(false)  

  const [search, setSearch] =  useState<string>('');
  const [limit, setLimit] =  useState<number>(10);
  const [page, setPage] =  useState<number>(1);
  const [reload, setReload] =  useState<number>(1);
  const [listItems, setListItems] = useState<JSX.Element[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<domainTable[]>([]);

  const [deleted, setDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const toggleCheckbox = (check:boolean) => {
    setDeleted(false)
    setSelectAll(check);
    const updatedData = rows.map((row) => ({
      ...row,
      selected: check,
    }));
    setRows(updatedData);
  }
  
  const toggleSelectAll = () => {
    toggleCheckbox(!selectAll)
  };

  const handleRowCheckboxChange = (id: number) => {
    setDeleted(false)
    const updatedData = rows.map((row) =>
      row.id === id ? { ...row, selected: !row.selected } : row
    );
    setRows(updatedData);
  };

  const deleteSingle = (id: number) => {
    setDeleted(false)
    const updatedData = rows.map((row) =>
      row.id === id ? { ...row, selected: true } : row
    );
    setRows(updatedData);
    setShowDelete(false)
    setConfirmDelete(true)
  };
  

  const callReload = (del:boolean) => {
    const d = new Date();
    const time = d.getTime();
    setReload(time);
    setDeleted(del);
  }
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    callReload(false);
  }

  const handleLimit = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1)
    callReload(false);
  };



  const handlePrevious = () => {
    if(page>1) setPage(page - 1);
    callReload(false);
  }

  const handleNext = () => {
    if(page<tableData.last_page) setPage(page + 1);
    callReload(false);
  }

  const deleteRows = async() => {
    const selected = rows.filter((row) => row.selected);
    let ids: Array<number> = [];
    selected.map((row) => ( 
      ids.push(row.id)
    ))

    if(ids.length>0) {
      setLoading(true)
      setShowDelete(false)
      setConfirmDelete(false)
      const res = await deleteDomains(ids);
      setLoading(false)
      if(res.domains.success){
        callReload(true);
        
      }
    }
  };
  useEffect(() => {
    const selected = rows.filter((row) => row.selected);
    setShowDelete(selected.length>0)
  },[rows]);

  useEffect(() => {
    const handlePage = (pageNo: number) => {
      setPage(pageNo)
      callReload(false);
    }
    const generateListItems = (t:domainTable) => {
      const items = [];
      for (let i = 1; i <= t.last_page; i++) {
        items.push(<li key={i}><a onClick={() => handlePage(i)} className="flex items-center justify-center rounded py-1.5 px-3 font-medium hover:bg-primary hover:text-white" href="#">{i}</a></li>);
      }
      setListItems(items);
    }

    const getAllDomains = async () => {
      setLoading(true)
     
      const res = await getDomains(search,limit,page);
      const tData = res.domains as domainTable;
      setTableData(tData);
      setRows(tData.data);
      setLoading(false)
      generateListItems(tData)
    };
    getAllDomains();
    // eslint-disable-next-line
  },[reload]);


  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">All Domains</h3>
        
      </div>
      {deleted?(
        <div className="mb-4">
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
                {'Deleted Successfully'}
              </h5>
              
            </div>
          </div>
        </div>
      ):''}

      <div className="flex flex-col gap-5.5 p-6.5">
        <div className="max-w-full overflow-x-auto">
          <div className="w-full pb-4 border-b border-b-[#eee] flex justify-between mb-4">
            {/* <div className="flex items-center space-x-2">
              <div>Filter</div>
              <div>
                <div className="relative">
                  <select className="border-form-stroke border-[#ddd] text-body-color focus:border-primary active:border-primary w-full appearance-none rounded-lg border-[1.5px] py-2 pl-4 pr-8 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]">
                    <option value="">All</option>
                    <option value="">Option</option>
                    <option value="">Option</option>
                  </select>
                  <span className="border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2"></span>
                </div>
              </div>
            </div> */}
            <div className="space-x-2">
              <button className="bg-primary inline-flex items-center justify-center rounded-md py-2 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4">
                <FaBuffer className="w-4 h-4 mr-2" />
                Bulk Add Domains
              </button>
              
              {confirmDelete?(
                  <>
                    <button onClick={deleteRows} className="bg-danger inline-flex items-center justify-center rounded-md py-2 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4">
                        <FaTimes className="w-4 h-4 mr-2" />
                        Continue Delete?
                      </button>
                      <button onClick={() => {
                        setShowDelete(false)
                        setConfirmDelete(false)
                        toggleCheckbox(false)
                      }} className="bg-success inline-flex items-center justify-center rounded-md py-2 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4">
                      <FaTimes className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
              ):(
                showDelete?(
                  <button onClick={() => {
                    setConfirmDelete(true)
                  }} className="bg-danger inline-flex items-center justify-center rounded-md py-2 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4">
                    <FaTimes className="w-4 h-4 mr-2" />
                    Delete Selected
                  </button>
                ):''
              )}
            </div>
          </div>

          <div className="w-full pb-4 flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div>
                <div className="relative">
                  <select value={limit} onChange={handleLimit} className="border-form-stroke border-[#ddd] text-body-color focus:border-primary active:border-primary w-full appearance-none rounded-lg border-[1.5px] py-2 pl-4 pr-8 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]">

                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2"></span>
                </div>
              </div>
              <div>records {loading?(<FaCircleNotch className="w-4 h-4 fa-spin" />):''} </div>
            </div>
            <div className="space-x-2 flex items-center">
              <div>search:</div>
              <div>
                <input value={search} onChange={handleSearchChange} 
                  type="text"
                  className="border-form-stroke border-[#ddd] text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-2 px-4 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]"
                />
              </div>
            </div>
          </div>

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  <input type="checkbox" id="" checked={selectAll}
                onChange={toggleSelectAll} />
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Domains</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Last Crawled Date</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Number of Items</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Notes</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
               {rows.map((item) => (
              <tr key={item.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <input type="checkbox" id="" checked={item.selected || false}
                  onChange={() => handleRowCheckboxChange(item.id)} />
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{item.domain_name}</h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{item.date_last_crawled}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">{item.no_of_items}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{item.status}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <button onClick={() => deleteSingle(item.id)} className="hover:text-primary">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        ></path>
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        ></path>
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        ></path>
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
                </tr>
            ))}
            </tbody>
          </table>
          <div className="flex w-full py-4 justify-between">
            <div className="font-medium text-[#666] dark:text-white">Showing {tData?.current_page} to {tData?.per_page} of {tData?.total} entries</div>
            {tData?(
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
                  <a onClick={() => handleNext()}
                    className="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                    href="#"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
            ):''}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDomains;
