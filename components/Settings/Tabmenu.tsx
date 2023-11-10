'use client';
import React, { useState } from 'react'
import EmailAccountSettings from '@/components/Settings/EmailAccountSettings';
import PasswordAccountSettings from '@/components/Settings/PasswordAccountSettings';
import DeleteAccountSettings from '@/components/Settings/DeleteAccountSettings';
import BasicInformation from '@/components/Settings/BasicInformation';
import {details} from "@/types/details";

export default function Tabmenu(userdetails: any) {
    const [activeTab, setActiveTab] = useState<number>(1);
    
    const handleTabClick = (tabNumber: number) => {
      setActiveTab(tabNumber);
    };

   
  
    return (
      <>
       
  
        <div
          className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-5">
          <div className="mb-4 p-7.5 w-full">
            <div
              className="mb-7.5 flex flex-wrap gap-3 rounded-lg border border-stroke py-3 px-4 dark:border-strokedark">
              <button
                className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => handleTabClick(1)}
              >
                Email Address
              </button>

              <button
                className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs hidden ${activeTab === 2 ? 'active' : ''}`}
                onClick={() => handleTabClick(2)}
              >
                Password
              </button>
  
              <button
                className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs ${activeTab === 3 ? 'active' : ''}`}
                onClick={() => handleTabClick(3)}
              >
                Delete this account
              </button>

              
              <button
                className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs ${activeTab === 4 ? 'active' : ''}`}
                onClick={() => handleTabClick(4)}
              >
                Basic Information
              </button>
  
            </div >
            <div>
              {
                activeTab === 1
                &&
                <>
                  <EmailAccountSettings userdetails={userdetails.userdetails}/>
                </>
              }
  
              {
                activeTab === 2
                &&
                <>
                  <PasswordAccountSettings />
                </>
              }
  
              {
                activeTab === 3
                &&
                <>
                  <DeleteAccountSettings />
                </>
              }

              {
                activeTab === 4
                &&
                <>
                  <BasicInformation userdetails={userdetails.userdetails}/>
                </>
              }

              
            </div>
          </div >
        </div>
  
      </>
    );
  };
  
  
  