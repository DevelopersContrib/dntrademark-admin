"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import { getItemProtests } from "@/lib/domain-helper";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { FaDumbbell, FaDumpster, FaGithub, FaCircleNotch } from 'react-icons/fa6';
import { items } from "@/types/items";
import { protest } from "@/types/protest";
import { protestTable } from "@/types/protestTable";
import LoadingRipple from "../Loading/LoadingRipple";
import Swal from 'sweetalert2'
import { useSession } from "next-auth/react";
import generatePDF from "react-to-pdf";

interface props {
  domainItems: items;
  tData: protestTable;
  id: number;
  template: string;
}

const ProtestList = ({ id, domainItems, template,tData }: props) => {
  const { data: session } = useSession();
  let reactQuillRef:any;
  let name: string | null | undefined = session?.user?.name;
  let email: string | null | undefined = session?.user?.email;

  if (typeof name === "string" && typeof email === "string") {
    template = template.replaceAll("[Your Name]", name);
    template = template.replaceAll("[Your Email Address]", email);

    // Get the current date
    var currentDate = new Date();

    // Define an array of month names
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the month, date, and year from the current date
    var month = monthNames[currentDate.getMonth()];
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();

    // Create the formatted date string
    var formattedDate = month + " " + day + ", " + year;

    // $file = str_replace('[Date]',date("F j, Y")  , $file);
    template = template.replaceAll("[Date]", formattedDate);
    template = template.replaceAll(
      "[Application Number]",
      domainItems.serial_number
    );
    template = template.replaceAll("[Applicant Name]", domainItems.owner.name);
    template = template.replaceAll(
      "[Application Label]",
      domainItems.owner.owner_label
    );
    template = template.replaceAll(
      "[Date of Application]",
      domainItems.filing_date
    );
    template = template.replaceAll("[Domain]", domainItems.domain.domain_name);
    template = template.replaceAll("[Keyword]", domainItems.keyword);

    template = template.split("\n").join("<br />");
    
  }

  const [saving, setSaving] = useState(false);
const [rows, setRows] = useState<protest[]>(tData.data);
const [tableData, setTableData] = useState<protestTable>(tData);
const [loading, setLoading] = useState(false);

const [orderBy, setOrderBy] = useState<string>("");
const [sortBy, setSortBy] = useState<string>("");
const [search, setSearch] = useState<string>("");
const [limit, setLimit] = useState<number>(10);
const [page, setPage] = useState<number>(1);
const [reload, setReload] = useState<number>(1);
const [listItems, setListItems] = useState<JSX.Element[]>([]);
const [selectAll, setSelectAll] = useState(false);
const [domain, setDomain] = useState("");
const [protestId, setProtestId] = useState(0);
const [editorState, setEditorState] = useState(template);

const [protestTitle, setProtestTitle] = useState<string>("");

const item_id = id;

const sort = (col: string) => {
  setSortBy(col);
  setOrderBy(orderBy === "ASC" ? "DESC" : "ASC");
};

const callReload = (del: boolean) => {
  const d = new Date();
  const time = d.getTime();
  setReload(time);
  setProtestId(0)
  setProtestTitle('')
};
const handleEdit = async(id:number) => {
  Swal.fire({
    title: 'Please wait',
    html: 'Retrieving Protest...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
});

    const res = await fetch('/api/item/protest/view', {
      method: 'POST',
      body: JSON.stringify({ id: id }),
    });
    Swal.close();
    const result = await res.json();
    const itemProtest  = result.item as protest;
    setProtestId(itemProtest.id)
    setProtestTitle(itemProtest.title)
    setEditorState(result.content.toString()) 
  }

  const handlePDF = async(id:number) => {
    Swal.fire({
      title: 'Please wait',
      html: 'Retrieving Protest...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
  });
  
    const res = await fetch('/api/item/protest/view', {
      method: 'POST',
      body: JSON.stringify({ id: id }),
    });
    Swal.close();
    const result = await res.json();
    const itemProtest  = result.item as protest;
    setProtestId(itemProtest.id)
    setProtestTitle(itemProtest.title)
    setEditorState(result.content.toString()) 

    var intro = document.getElementsByClassName("ql-editor")[0]
    intro.setAttribute("id", "forpdfdownload")
    const getTargetElement = () =>document.getElementById("forpdfdownload");
    generatePDF(getTargetElement, {
      filename: itemProtest.title.replace(/\s/g, '') + ".pdf",
    });
  }

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
  const generateListItems = (t: protestTable) => {
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

    const res = await getItemProtests(
      item_id,
      search,
      limit,
      page,
      sortBy,
      orderBy
    );
    
    const tData = res.items as protestTable;

    setTableData(tData);
    setRows(tData.data);
    setLoading(false);
    generateListItems(tData);
  };
  getAllItems();
  // eslint-disable-next-line
}, [reload]);

  

  const handleProtestTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;

    setProtestTitle(value);
  }

  const htmlEncode = (content: string) => {
    return String(content)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const handleSaveProtest = async () => {
 
  const html =  reactQuillRef.props.value

    if (protestTitle) {
      setSaving(true)
      if(protestId==0){
        const res = await fetch('/api/domain/items/protests/save', {
          method: 'POST',
          body: JSON.stringify({ item_id: id, title: protestTitle, content: html }),
        });
        setSaving(false)
        const result = await res.json();
  
        if (result.success) {
          callReload(true);
          Swal.fire(
            'Saved!',
            'You have successfully generated a protest letter.',
            'success'
          );
        } else {
          Swal.fire(
            'Oops!',
            'An error occured during saving. Please try again!',
            'error'
          );
        }
      }else{
        const res = await fetch('/api/item/protest/update', {
          method: 'POST',
          body: JSON.stringify({id:protestId, item_id: id, title: protestTitle, content: html }),
        });
        setSaving(false)
        const result = await res.json();
  
        if (result.success) {
          callReload(true);
          Swal.fire(
            'Saved!',
            'You have successfully updated the protest letter.',
            'success'
          );
        } else {
          Swal.fire(
            'Oops!',
            'An error occured during saving. Please try again!',
            'error'
          );
        }
      }
    }else{
      Swal.fire(
        'Oops!',
        'Please enter Protest title',
        'error'
      );
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white capitalize">
          {domainItems.domain.domain_name} Item Serial Number (
          {domainItems.serial_number}) Protest List
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/">
                Dashboard /
              </a>
            </li>
            <li>
              <a className="font-medium" href="/domain/with-hits">
                Domain with hits /
              </a>
            </li>
            <li className="font-medium text-primary capitalize">
              {/* {domain} Items */}
            </li>
          </ol>
        </nav>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
        <div className="flex flex-col gap-5.5 p-6.5">
          <div className="max-w-full overflow-x-auto">
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
                  <th
                    onClick={() => sort("id")}
                    className={
                      "min-w-[120px] table-th-header sorting " +
                      (sortBy === "id"
                        ? orderBy === "ASC"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : "")
                    }
                  >
                    ID
                  </th>
                  <th
                    onClick={() => sort("title")}
                    className={
                      "min-w-[150px] table-th-header sorting " +
                      (sortBy === "registration_number"
                        ? orderBy === "ASC"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : "")
                    }
                  >
                    Title
                  </th>
                  <th
                    onClick={() => sort("created_at")}
                    className={
                      "min-w-[120px] table-th-header sorting " +
                      (sortBy === "serial_number"
                        ? orderBy === "ASC"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : "")
                    }
                  >
                    Date Created
                  </th>
                  <th className="table-th-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} align="center">
                      <div className="flex w-full items-center justify-center py-4 text-[#c5c5c5]">
                        <LoadingRipple />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {rows.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.id}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.title}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.created_at}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="flex items-center space-x-3.5">
                              <button onClick={() => handleEdit(item.id)} className="bg-primary inline-flex items-center justify-center rounded-md py-2 px-10 text-center text-sm font-normal text-white hover:bg-opacity-90 lg:px-4">
                                Edit
                              </button>
                              <button onClick={() => handlePDF(item.id)} className="bg-primary inline-flex items-center justify-center rounded-md py-2 px-10 text-center text-sm font-normal text-white hover:bg-opacity-90 lg:px-4">
                                Download PDF
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
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
     
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
        <div className="flex flex-col gap-5.5 p-6.5">
          <div className="border border-[#f1f1f1] p-1.5">
            <input
              className="w-full rounded border border-stroke py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="title"
              id="title"
              placeholder="Add title to your protest here..."
              defaultValue={protestTitle}
              onChange={(e) => {handleProtestTitleChange(e)}}
            />
           
            <ReactQuill theme="snow" value={editorState} onChange={setEditorState}
            ref={(el) => {
              reactQuillRef = el;
            }}
            />

          </div>
          <button onClick={handleSaveProtest} className="bg-primary inline-flex items-center justify-center rounded-md py-2 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4">
          {saving && <FaCircleNotch className="w-4 h-4 fa-spin mr-2" />} Save
          </button>
        </div>
      </div>
    </>
  );
};

export default ProtestList;
