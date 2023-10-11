"use client"
import React, { useState } from 'react'
import Tabs from '@/components/onboarding/Tabs';

const page = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };
  return (
    <>
      <div
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Onboarding
          </h3>
        </div>
        <div className="mb-4 p-7.5 w-full">
          <div
            className="mb-7.5 flex flex-wrap gap-3 rounded-lg border border-stroke py-3 px-4 dark:border-strokedark">
            <button
              className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => handleTabClick(1)}
            >
              Add Domains
            </button>
            <button
              className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => handleTabClick(2)}
            >
              Upload Domains
            </button>

          </div >
          <div>
            {
              activeTab === 1
              &&
              <Tabs>
                <div className="mb-4">
                  <div
                    className="flex w-full rounded-lg border-l-[6px] border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md md:p-9"
                  >
                    <div
                      className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]"
                    >
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
                        Message Sent Successfully
                      </h5>
                      <p className="text-base leading-relaxed text-body-color">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  Add Domains <small>(separate domain by new line)</small>
                </div>
                <textarea className="border-form-stroke text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]" rows={5}></textarea>

                <button className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>Submit</button>
              </Tabs>
            }

            {
              activeTab === 2
              &&
              <Tabs>
                <div className="mb-4">
                  <div
                    className="flex w-full rounded-lg border-l-[6px] border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md md:p-9"
                  >
                    <div
                      className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]"
                    >
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
                        Message Sent Successfully
                      </h5>
                      <p className="text-base leading-relaxed text-body-color">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  Upload File <small>(.csv)</small>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-full">
                  <div className="mb-4">
                    <label className="mb-3 block text-base font-medium text-black">
                      Attachments
                    </label>
                    <div className="relative">
                      <label className="flex min-h-[175px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-primary p-6">
                        <div>
                          <input type="file" name="file" id="file" className="sr-only" />
                          <span className="mx-auto mb-3 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-stroke bg-white">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M2.5013 11.666C2.96154 11.666 3.33464 12.0391 3.33464 12.4993V15.8327C3.33464 16.0537 3.42243 16.2657 3.57871 16.4219C3.73499 16.5782 3.94695 16.666 4.16797 16.666H15.8346C16.0556 16.666 16.2676 16.5782 16.4239 16.4219C16.5802 16.2657 16.668 16.0537 16.668 15.8327V12.4993C16.668 12.0391 17.0411 11.666 17.5013 11.666C17.9615 11.666 18.3346 12.0391 18.3346 12.4993V15.8327C18.3346 16.4957 18.0712 17.1316 17.6024 17.6004C17.1336 18.0693 16.4977 18.3327 15.8346 18.3327H4.16797C3.50493 18.3327 2.86904 18.0693 2.4002 17.6004C1.93136 17.1316 1.66797 16.4957 1.66797 15.8327V12.4993C1.66797 12.0391 2.04106 11.666 2.5013 11.666Z" fill="#3056D3"></path>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41074 1.91009C9.73618 1.58466 10.2638 1.58466 10.5893 1.91009L14.7559 6.07676C15.0814 6.4022 15.0814 6.92984 14.7559 7.25527C14.4305 7.58071 13.9028 7.58071 13.5774 7.25527L10 3.67786L6.42259 7.25527C6.09715 7.58071 5.56951 7.58071 5.24408 7.25527C4.91864 6.92984 4.91864 6.4022 5.24408 6.07676L9.41074 1.91009Z" fill="#3056D3"></path>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0013 1.66602C10.4615 1.66602 10.8346 2.03911 10.8346 2.49935V12.4994C10.8346 12.9596 10.4615 13.3327 10.0013 13.3327C9.54106 13.3327 9.16797 12.9596 9.16797 12.4994V2.49935C9.16797 2.03911 9.54106 1.66602 10.0013 1.66602Z" fill="#3056D3"></path>
                            </svg>
                          </span>
                          <span className="text-base text-body-color">
                            Drag &amp; drop or
                            <span className="text-primary underline"> browse </span>
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <button className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>Submit</button>
              </Tabs>
            }
          </div>
        </div >
      </div >
    </>
  )
}

export default page