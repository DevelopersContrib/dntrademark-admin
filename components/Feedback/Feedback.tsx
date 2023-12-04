import React from "react";

export default function Feedback() {
  return (
    <>
      <div className="w-full lg:max-w-[600px] lg:mx-auto">
        <div className="flex w-full rounded-lg border-l-[6px] border-[#00B078] bg-[#C4F9E2] bg-opacity-[100%] px-7 py-8 shadow-md md:p-9 mb-8">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#00B078]">
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
            <h5 className="mb-3 text-lg font-semibold text-[#004434]">
              Success!
            </h5>
            <p className="text-base leading-relaxed text-body-color">
              Thank you!
            </p>
          </div>
        </div>
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
            <button className="bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#1B44C8] hover:border-[#1B44C8] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#1B44C8] active:border-[#1B44C8] w-full">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
