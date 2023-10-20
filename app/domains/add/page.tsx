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
            Add Domain
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