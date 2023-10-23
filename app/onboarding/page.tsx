"use client"
import React, { useState } from 'react'
import Tabs from '@/components/onboarding/Tabs';
import DomainForm from '@/components/onboarding/DomainForm';
import UploadForm from '@/components/onboarding/UploadForm';

const Page = () => {
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
        <div className="onboard-content mb-0 p-7.5 w-full">
          <div className="flex w-full rounded-lg border-l-[6px] border-[#00B078] bg-[#C4F9E2] bg-opacity-[100%] px-7 py-8 shadow-md md:p-9">
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
              Welcome to DNTrademark 
              </h5>
              <p className="text-base leading-relaxed text-body-color">
              We're thrilled to have you join us on this journey to protect your trademarks and intellectual property. Our platform offers a simple  suite of tools and services to make trademark registration and management seamless.
              </p>
            </div>
          </div>
          <div className="mt-5 mx-auto sm:container">
            <div className="border-stroke">
              <h5 className="mb-2 text-lg font-semibold text-dark">Why Trademark Matters</h5>
              <div className="mb-3">
                <div className="flex w-full px-1 py-1">
                  <div className="mr-3 flex h-6 w-full max-w-[24px] items-center justify-center rounded-lg bg-[#4C4C4C]">
                  <span className="font-semibold text-[#ffffff]">1</span> 
                  </div>
                  <div className="w-full">
                    <h5 className="mb-1 text-base font-semibold text-[#535353]">
                    Trademarks are the cornerstone of brand identity.
                    </h5>
                  </div>
                </div>
                <div className="flex w-full px-1 py-1">
                  <div className="mr-3 flex h-6 w-full max-w-[24px] items-center justify-center rounded-lg bg-[#4C4C4C]">
                  <span className="font-semibold text-[#ffffff]">2</span>
                  </div>
                  <div className="w-full">
                    <h5 className="mb-1 text-base font-semibold text-[#535353]">
                    Protecting your trademarks ensures that your unique products and services remain distinguishable in the marketplace.
                    </h5>
                  </div>
                </div>
                <div className="flex w-full px-1 py-1">
                  <div className="mr-3 flex h-6 w-full max-w-[24px] items-center justify-center rounded-lg bg-[#4C4C4C]">
                  <span className="font-semibold text-[#ffffff]">3</span>
                  </div>
                  <div className="w-full">
                    <h5 className="mb-1 text-base font-semibold text-[#535353]">
                    It prevents others from using your brand identity for their gain.
                    </h5>
                  </div>
                </div>
              </div>
              <h5 className="mb-2 text-lg font-semibold text-dark">What’s next?</h5>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-3">                  
                  <div className="rounded-md bg-[#C4F9E2] p-4">
                    <p className="flex items-center text-sm font-medium text-[#004434]">
                      <span className="pr-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="#00B078"></circle>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1203 6.78954C14.3865 7.05581 14.3865 7.48751 14.1203 7.75378L9.12026 12.7538C8.85399 13.02 8.42229 13.02 8.15602 12.7538L5.88329 10.4811C5.61703 10.2148 5.61703 9.78308 5.88329 9.51682C6.14956 9.25055 6.58126 9.25055 6.84753 9.51682L8.63814 11.3074L13.156 6.78954C13.4223 6.52328 13.854 6.52328 14.1203 6.78954Z" fill="white"></path>
                        </svg>
                      </span>
                      Upload your documents
                    </p>
                  </div>
                </div>
                <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-3">                  
                  <div className="rounded-md bg-[#C4F9E2] p-4">
                    <p className="flex items-center text-sm font-medium text-[#004434]">
                      <span className="pr-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="#00B078"></circle>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1203 6.78954C14.3865 7.05581 14.3865 7.48751 14.1203 7.75378L9.12026 12.7538C8.85399 13.02 8.42229 13.02 8.15602 12.7538L5.88329 10.4811C5.61703 10.2148 5.61703 9.78308 5.88329 9.51682C6.14956 9.25055 6.58126 9.25055 6.84753 9.51682L8.63814 11.3074L13.156 6.78954C13.4223 6.52328 13.854 6.52328 14.1203 6.78954Z" fill="white"></path>
                        </svg>
                      </span>
                      Check out our FAQ
                    </p>
                  </div>
                </div>
                <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-3">                  
                  <div className="rounded-md bg-[#C4F9E2] p-4">
                    <p className="flex items-center text-sm font-medium text-[#004434]">
                      <span className="pr-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="#00B078"></circle>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1203 6.78954C14.3865 7.05581 14.3865 7.48751 14.1203 7.75378L9.12026 12.7538C8.85399 13.02 8.42229 13.02 8.15602 12.7538L5.88329 10.4811C5.61703 10.2148 5.61703 9.78308 5.88329 9.51682C6.14956 9.25055 6.58126 9.25055 6.84753 9.51682L8.63814 11.3074L13.156 6.78954C13.4223 6.52328 13.854 6.52328 14.1203 6.78954Z" fill="white"></path>
                        </svg>
                      </span>
                      Support
                    </p>
                  </div>
                </div>
                <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-3">                  
                  <div className="rounded-md bg-[#C4F9E2] p-4">
                    <p className="flex items-center text-sm font-medium text-[#004434]">
                      <span className="pr-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="#00B078"></circle>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1203 6.78954C14.3865 7.05581 14.3865 7.48751 14.1203 7.75378L9.12026 12.7538C8.85399 13.02 8.42229 13.02 8.15602 12.7538L5.88329 10.4811C5.61703 10.2148 5.61703 9.78308 5.88329 9.51682C6.14956 9.25055 6.58126 9.25055 6.84753 9.51682L8.63814 11.3074L13.156 6.78954C13.4223 6.52328 13.854 6.52328 14.1203 6.78954Z" fill="white"></path>
                        </svg>
                      </span>
                      Refer DNTrademark
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                <DomainForm></DomainForm>
              </Tabs>
            }

            {
              activeTab === 2
              &&
              <Tabs>
                <UploadForm></UploadForm>
              </Tabs>
            }
          </div>
        </div >
      </div >
    </>
  )
}

export default Page