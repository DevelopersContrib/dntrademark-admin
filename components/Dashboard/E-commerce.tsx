"use client";
import { useEffect, useState, use } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import React from "react";
import WelcomeNotif from "../Dashboard/WelcomeNotif";
import { domainTable } from "@/types/domainTable";
import CardDataStats from "../CardDataStats";
import DomainList from "@/components/Domains/DomainList";
import RecentList from "@/components/Domains/RecentDomains";
import LatestBlog from "@/components/Dashboard/LatestBlog";
import { Stat } from "@/types/stats";

// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import ChartOne from "../Charts/ChartOne";
import { FaCubes } from "react-icons/fa6";
import { AiOutlineBarChart, AiOutlineLineChart } from "react-icons/ai";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

interface tableProps {
  tData: domainTable;
  stats: Stat;
  recent: domainTable;
  feed: string | "";
}

export default function ECommerce({ tData, stats, recent, feed }: tableProps) {
  // console.log('client tData:',tData)
  // console.log('client tData.current_page:',tData.current_page)
  // console.log('client stats:',stats)
  // console.log('client stats.domainsCount:',stats.domainsCount)

  let initialStats = {
    domainsCount: 0,
    hitsCount: 0,
    noHitsCount: 0,
    domainsAtRiskCount: 0,
  };

  if (stats === undefined) {
  } else {
    initialStats = {
      domainsCount: stats.domainsCount,
      hitsCount: stats.hitsCount,
      noHitsCount: stats.noHitsCount,
      domainsAtRiskCount: stats.domainsAtRiskCount,
    };
  }

  const [values, setQuotes] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <WelcomeNotif />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Domains"
          total={String(values.domainsCount ? values.domainsCount : 0)}
          rate=""
          levelUp
        >
          <FaCubes className="w-5 h-5"  />
        </CardDataStats>

        <CardDataStats
          bgCard="bg-red-gradient-1 bg-gradient"
          title="Domains with Hits"
          total={String(values.hitsCount ? values.hitsCount : 0)}
          rate=""
          levelUp
        >
          <AiOutlineBarChart className="w-5 h-5 text-white" />
        </CardDataStats>
        
        <CardDataStats
          bgCard="bg-green-gradient-1 bg-gradient"
          title="Domains without Hits"
          total={String(values.noHitsCount ? values.noHitsCount : 0)}
          rate=""
          levelUp
        >
         <AiOutlineLineChart className="w-5 h-5 text-white" />
        </CardDataStats>
        <CardDataStats
          
          title="Domains at Risk"
          total={String(
            values.domainsAtRiskCount ? values.domainsAtRiskCount : 0
          )}
          rate=""
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
              fill=""
            />
            <path
              d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>
      <div className="w-full mb-4 text-sm"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <DomainList domains={tData.data} />
        <RecentList domains={recent.data} />
        <LatestBlog feed={feed} />

        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h5 className="mb-2 text-lg font-semibold text-dark">
            Latest Twitter Posts
          </h5>
          <ul>
            <li className="text-body-color mb-4 flex text-base">
              <span className="text-primary mr-2 rounded-full text-base">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="fill-current"
                >
                  <path d="M4.36064 17.6344C4.13564 17.6344 3.91064 17.5781 3.71376 17.4375C3.34814 17.1844 3.15126 16.7344 3.23564 16.2844L3.99501 11.5031L0.70439 8.09998C0.395015 7.7906 0.282515 7.31248 0.42314 6.8906C0.563765 6.46873 0.901265 6.18748 1.32314 6.1031L5.90751 5.37185L7.96064 1.01248C8.15751 0.618726 8.55126 0.365601 8.97314 0.365601C9.42314 0.365601 9.78876 0.618726 9.98564 1.01248L12.095 5.34373L16.6794 6.07498C17.1013 6.13123 17.4388 6.4406 17.5794 6.86248C17.72 7.28435 17.6075 7.76248 17.2981 8.07185L13.9794 11.475L14.7669 16.2844C14.8513 16.7344 14.6544 17.1844 14.2888 17.4375C13.9513 17.6906 13.5013 17.7187 13.1075 17.5219L9.00126 15.2719L4.89501 17.5219C4.72626 17.6062 4.55751 17.6344 4.36064 17.6344ZM1.40752 7.42498L4.81064 10.9125C4.97939 11.0812 5.06376 11.3344 5.00751 11.5875L4.22001 16.4531C4.19189 16.5656 4.27626 16.6219 4.30439 16.65C4.36064 16.7062 4.41689 16.6781 4.44501 16.65L8.66376 14.3437C8.88876 14.2312 9.14189 14.2312 9.36689 14.3437L13.5856 16.6219C13.6138 16.6219 13.6419 16.65 13.7263 16.6219C13.7544 16.5937 13.8106 16.5375 13.8106 16.425L13.0231 11.5312C12.995 11.2781 13.0513 11.0531 13.22 10.8562L16.595 7.36873C16.6794 7.28435 16.6513 7.19998 16.6513 7.14373C16.6513 7.1156 16.595 7.03123 16.5388 7.03123L11.8138 6.29998C11.5606 6.27185 11.3638 6.1031 11.2513 5.8781L9.14189 1.43435C9.11376 1.34998 9.05751 1.34998 9.00126 1.34998C8.97314 1.34998 8.91689 1.3781 8.86064 1.43435L6.75126 5.90623C6.63876 6.13123 6.44189 6.29998 6.18876 6.3281L1.49189 7.08748C1.40752 7.08748 1.37939 7.17185 1.37939 7.19998C1.35127 7.2281 1.32314 7.3406 1.40752 7.42498Z"></path>
                </svg>
              </span>
              <a href="">The point of using Lorem Ipsum...</a>
            </li>
            <li className="text-body-color mb-4 flex text-base">
              <span className="text-primary mr-2 rounded-full text-base">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="fill-current"
                >
                  <path d="M4.36064 17.6344C4.13564 17.6344 3.91064 17.5781 3.71376 17.4375C3.34814 17.1844 3.15126 16.7344 3.23564 16.2844L3.99501 11.5031L0.70439 8.09998C0.395015 7.7906 0.282515 7.31248 0.42314 6.8906C0.563765 6.46873 0.901265 6.18748 1.32314 6.1031L5.90751 5.37185L7.96064 1.01248C8.15751 0.618726 8.55126 0.365601 8.97314 0.365601C9.42314 0.365601 9.78876 0.618726 9.98564 1.01248L12.095 5.34373L16.6794 6.07498C17.1013 6.13123 17.4388 6.4406 17.5794 6.86248C17.72 7.28435 17.6075 7.76248 17.2981 8.07185L13.9794 11.475L14.7669 16.2844C14.8513 16.7344 14.6544 17.1844 14.2888 17.4375C13.9513 17.6906 13.5013 17.7187 13.1075 17.5219L9.00126 15.2719L4.89501 17.5219C4.72626 17.6062 4.55751 17.6344 4.36064 17.6344ZM1.40752 7.42498L4.81064 10.9125C4.97939 11.0812 5.06376 11.3344 5.00751 11.5875L4.22001 16.4531C4.19189 16.5656 4.27626 16.6219 4.30439 16.65C4.36064 16.7062 4.41689 16.6781 4.44501 16.65L8.66376 14.3437C8.88876 14.2312 9.14189 14.2312 9.36689 14.3437L13.5856 16.6219C13.6138 16.6219 13.6419 16.65 13.7263 16.6219C13.7544 16.5937 13.8106 16.5375 13.8106 16.425L13.0231 11.5312C12.995 11.2781 13.0513 11.0531 13.22 10.8562L16.595 7.36873C16.6794 7.28435 16.6513 7.19998 16.6513 7.14373C16.6513 7.1156 16.595 7.03123 16.5388 7.03123L11.8138 6.29998C11.5606 6.27185 11.3638 6.1031 11.2513 5.8781L9.14189 1.43435C9.11376 1.34998 9.05751 1.34998 9.00126 1.34998C8.97314 1.34998 8.91689 1.3781 8.86064 1.43435L6.75126 5.90623C6.63876 6.13123 6.44189 6.29998 6.18876 6.3281L1.49189 7.08748C1.40752 7.08748 1.37939 7.17185 1.37939 7.19998C1.35127 7.2281 1.32314 7.3406 1.40752 7.42498Z"></path>
                </svg>
              </span>
              <a href="">The point of using Lorem Ipsum...</a>
            </li>
            <li className="text-body-color mb-4 flex text-base">
              <span className="text-primary mr-2 rounded-full text-base">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="fill-current"
                >
                  <path d="M4.36064 17.6344C4.13564 17.6344 3.91064 17.5781 3.71376 17.4375C3.34814 17.1844 3.15126 16.7344 3.23564 16.2844L3.99501 11.5031L0.70439 8.09998C0.395015 7.7906 0.282515 7.31248 0.42314 6.8906C0.563765 6.46873 0.901265 6.18748 1.32314 6.1031L5.90751 5.37185L7.96064 1.01248C8.15751 0.618726 8.55126 0.365601 8.97314 0.365601C9.42314 0.365601 9.78876 0.618726 9.98564 1.01248L12.095 5.34373L16.6794 6.07498C17.1013 6.13123 17.4388 6.4406 17.5794 6.86248C17.72 7.28435 17.6075 7.76248 17.2981 8.07185L13.9794 11.475L14.7669 16.2844C14.8513 16.7344 14.6544 17.1844 14.2888 17.4375C13.9513 17.6906 13.5013 17.7187 13.1075 17.5219L9.00126 15.2719L4.89501 17.5219C4.72626 17.6062 4.55751 17.6344 4.36064 17.6344ZM1.40752 7.42498L4.81064 10.9125C4.97939 11.0812 5.06376 11.3344 5.00751 11.5875L4.22001 16.4531C4.19189 16.5656 4.27626 16.6219 4.30439 16.65C4.36064 16.7062 4.41689 16.6781 4.44501 16.65L8.66376 14.3437C8.88876 14.2312 9.14189 14.2312 9.36689 14.3437L13.5856 16.6219C13.6138 16.6219 13.6419 16.65 13.7263 16.6219C13.7544 16.5937 13.8106 16.5375 13.8106 16.425L13.0231 11.5312C12.995 11.2781 13.0513 11.0531 13.22 10.8562L16.595 7.36873C16.6794 7.28435 16.6513 7.19998 16.6513 7.14373C16.6513 7.1156 16.595 7.03123 16.5388 7.03123L11.8138 6.29998C11.5606 6.27185 11.3638 6.1031 11.2513 5.8781L9.14189 1.43435C9.11376 1.34998 9.05751 1.34998 9.00126 1.34998C8.97314 1.34998 8.91689 1.3781 8.86064 1.43435L6.75126 5.90623C6.63876 6.13123 6.44189 6.29998 6.18876 6.3281L1.49189 7.08748C1.40752 7.08748 1.37939 7.17185 1.37939 7.19998C1.35127 7.2281 1.32314 7.3406 1.40752 7.42498Z"></path>
                </svg>
              </span>
              <a href="">The point of using Lorem Ipsum...</a>
            </li>
            <li className="text-body-color mb-4 flex text-base">
              <span className="text-primary mr-2 rounded-full text-base">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="fill-current"
                >
                  <path d="M4.36064 17.6344C4.13564 17.6344 3.91064 17.5781 3.71376 17.4375C3.34814 17.1844 3.15126 16.7344 3.23564 16.2844L3.99501 11.5031L0.70439 8.09998C0.395015 7.7906 0.282515 7.31248 0.42314 6.8906C0.563765 6.46873 0.901265 6.18748 1.32314 6.1031L5.90751 5.37185L7.96064 1.01248C8.15751 0.618726 8.55126 0.365601 8.97314 0.365601C9.42314 0.365601 9.78876 0.618726 9.98564 1.01248L12.095 5.34373L16.6794 6.07498C17.1013 6.13123 17.4388 6.4406 17.5794 6.86248C17.72 7.28435 17.6075 7.76248 17.2981 8.07185L13.9794 11.475L14.7669 16.2844C14.8513 16.7344 14.6544 17.1844 14.2888 17.4375C13.9513 17.6906 13.5013 17.7187 13.1075 17.5219L9.00126 15.2719L4.89501 17.5219C4.72626 17.6062 4.55751 17.6344 4.36064 17.6344ZM1.40752 7.42498L4.81064 10.9125C4.97939 11.0812 5.06376 11.3344 5.00751 11.5875L4.22001 16.4531C4.19189 16.5656 4.27626 16.6219 4.30439 16.65C4.36064 16.7062 4.41689 16.6781 4.44501 16.65L8.66376 14.3437C8.88876 14.2312 9.14189 14.2312 9.36689 14.3437L13.5856 16.6219C13.6138 16.6219 13.6419 16.65 13.7263 16.6219C13.7544 16.5937 13.8106 16.5375 13.8106 16.425L13.0231 11.5312C12.995 11.2781 13.0513 11.0531 13.22 10.8562L16.595 7.36873C16.6794 7.28435 16.6513 7.19998 16.6513 7.14373C16.6513 7.1156 16.595 7.03123 16.5388 7.03123L11.8138 6.29998C11.5606 6.27185 11.3638 6.1031 11.2513 5.8781L9.14189 1.43435C9.11376 1.34998 9.05751 1.34998 9.00126 1.34998C8.97314 1.34998 8.91689 1.3781 8.86064 1.43435L6.75126 5.90623C6.63876 6.13123 6.44189 6.29998 6.18876 6.3281L1.49189 7.08748C1.40752 7.08748 1.37939 7.17185 1.37939 7.19998C1.35127 7.2281 1.32314 7.3406 1.40752 7.42498Z"></path>
                </svg>
              </span>
              <a href="">The point of using Lorem Ipsum...</a>
            </li>
            <li className="text-body-color mb-4 flex text-base">
              <span className="text-primary mr-2 rounded-full text-base">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="fill-current"
                >
                  <path d="M4.36064 17.6344C4.13564 17.6344 3.91064 17.5781 3.71376 17.4375C3.34814 17.1844 3.15126 16.7344 3.23564 16.2844L3.99501 11.5031L0.70439 8.09998C0.395015 7.7906 0.282515 7.31248 0.42314 6.8906C0.563765 6.46873 0.901265 6.18748 1.32314 6.1031L5.90751 5.37185L7.96064 1.01248C8.15751 0.618726 8.55126 0.365601 8.97314 0.365601C9.42314 0.365601 9.78876 0.618726 9.98564 1.01248L12.095 5.34373L16.6794 6.07498C17.1013 6.13123 17.4388 6.4406 17.5794 6.86248C17.72 7.28435 17.6075 7.76248 17.2981 8.07185L13.9794 11.475L14.7669 16.2844C14.8513 16.7344 14.6544 17.1844 14.2888 17.4375C13.9513 17.6906 13.5013 17.7187 13.1075 17.5219L9.00126 15.2719L4.89501 17.5219C4.72626 17.6062 4.55751 17.6344 4.36064 17.6344ZM1.40752 7.42498L4.81064 10.9125C4.97939 11.0812 5.06376 11.3344 5.00751 11.5875L4.22001 16.4531C4.19189 16.5656 4.27626 16.6219 4.30439 16.65C4.36064 16.7062 4.41689 16.6781 4.44501 16.65L8.66376 14.3437C8.88876 14.2312 9.14189 14.2312 9.36689 14.3437L13.5856 16.6219C13.6138 16.6219 13.6419 16.65 13.7263 16.6219C13.7544 16.5937 13.8106 16.5375 13.8106 16.425L13.0231 11.5312C12.995 11.2781 13.0513 11.0531 13.22 10.8562L16.595 7.36873C16.6794 7.28435 16.6513 7.19998 16.6513 7.14373C16.6513 7.1156 16.595 7.03123 16.5388 7.03123L11.8138 6.29998C11.5606 6.27185 11.3638 6.1031 11.2513 5.8781L9.14189 1.43435C9.11376 1.34998 9.05751 1.34998 9.00126 1.34998C8.97314 1.34998 8.91689 1.3781 8.86064 1.43435L6.75126 5.90623C6.63876 6.13123 6.44189 6.29998 6.18876 6.3281L1.49189 7.08748C1.40752 7.08748 1.37939 7.17185 1.37939 7.19998C1.35127 7.2281 1.32314 7.3406 1.40752 7.42498Z"></path>
                </svg>
              </span>
              <a href="">The point of using Lorem Ipsum...</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full mb-4 text-sm"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h5 className="mb-2 text-lg font-semibold text-dark">
            Investor Space
          </h5>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                0
              </h4>
              <span className="text-sm font-medium">
                Total number of domains tracked
              </span>
            </div>
            <span className="items-center gap-1 text-sm font-medium text-meta-3 undefined ">
              <div className="text-primary mr-2 flex items-center rounded-full text-base">
                <div>
                  <svg
                    width="30"
                    height="8"
                    viewBox="0 0 30 8"
                    className="fill-current"
                  >
                    <path d="M19.2188 2.90626L17.0625 0.343758C16.875 0.125008 16.5312 0.0937583 16.2812 0.281258C16.0625 0.468758 16.0312 0.812508 16.2188 1.06251L18.25 3.46876H0.9375C0.625 3.46876 0.375 3.71876 0.375 4.03126C0.375 4.34376 0.625 4.59376 0.9375 4.59376H18.25L16.2188 7.00001C16.0312 7.21876 16.0625 7.56251 16.2812 7.78126C16.375 7.87501 16.5 7.90626 16.625 7.90626C16.7812 7.90626 16.9375 7.84376 17.0312 7.71876L19.1875 5.15626C19.75 4.46876 19.75 3.53126 19.2188 2.90626Z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <a href="">Invest</a>
              </div>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full mb-4 text-sm"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="hidden">
          <ChartOne />
          </div>
        </div>
      </div>
    </>
  );
}
