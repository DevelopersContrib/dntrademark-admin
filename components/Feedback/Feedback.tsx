import React from "react";

export default function Feedback() {
  return (
    <>
      <div className="w-full lg:max-w-[600px] lg:mx-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-bold text-black dark:text-white text-base">
              Feedback
            </h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <div className="mb-5">
              <label htmlFor="">Email</label>
              <input
                type="text"
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="">Name</label>
              <input
                type="text"
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="">Message</label>
              <textarea
                rows={3}
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 p-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
              ></textarea>
            </div>
            <button
              className="bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#1B44C8] hover:border-[#1B44C8] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#1B44C8] active:border-[#1B44C8] w-full"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
