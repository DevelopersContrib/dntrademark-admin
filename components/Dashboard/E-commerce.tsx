"use client";
import { useEffect, useState, use } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import React from "react";
import WelcomeNotif from "../Dashboard/WelcomeNotif";
import { domainTable } from "@/types/domainTable";
import { graph } from "@/types/graph";
import CardDataStats from "../CardDataStats";
import TwitterPosts from "@/components/Dashboard/TwitterPosts";
import DomainList from "@/components/Domains/DomainList";
import RecentList from "@/components/Domains/RecentDomains";
import LatestBlog from "@/components/Dashboard/LatestBlog";
import { Stat } from "@/types/stats";

// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import ChartOne from "../Charts/ChartOne";
import { FaCubes } from "react-icons/fa6";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { AiOutlineBarChart, AiOutlineLineChart } from "react-icons/ai";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

interface tableProps {
  tData: domainTable;
  stats: Stat;
  recent: domainTable;
  feed: string | "";
  graph: graph[];
}

export default function ECommerce({
  tData,
  stats,
  recent,
  feed,
  graph,
}: tableProps) {
  // console.log('client tData:',tData)
  // console.log('client tData.current_page:',tData.current_page)
  // console.log('client stats:',stats)
  // console.log('client stats.domainsCount:',stats.domainsCount)

  let initialStats = {
    domainsCount: 0,
    hitsCount: 0,
    noHitsCount: 0,
    domainsAtRiskCount: 0,
    investorSpaceCount: 0,
  };

  if (stats === undefined) {
  } else {
    initialStats = {
      domainsCount: stats.domainsCount,
      hitsCount: stats.hitsCount,
      noHitsCount: stats.noHitsCount,
      domainsAtRiskCount: stats.domainsAtRiskCount,
      investorSpaceCount: stats.investorSpaceCount,
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
          <FaCubes className="w-5 h-5" />
        </CardDataStats>

        <CardDataStats
          bgCard="bg-red-gradient-1 bg-gradient"
          title="Domains with Hits"
          total={String(values.hitsCount ? values.hitsCount : 0)}
          rate=""
          levelUp
        >
          <AiOutlineBarChart className="w-5 h-5 stats-icon-color" />
        </CardDataStats>

        <CardDataStats
          bgCard="bg-green-gradient-1 bg-gradient"
          title="Domains without Hits"
          total={String(values.noHitsCount ? values.noHitsCount : 0)}
          rate=""
          levelUp
        >
          <AiOutlineLineChart className="w-5 h-5 stats-icon-color" />
        </CardDataStats>
        <CardDataStats title="Investor Space" total="+2,7432" rate="" levelUp>
          <BiSolidBarChartAlt2 className="w-5 h-5" />
        </CardDataStats>
      </div>
      <div className="w-full mb-4 text-sm"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <DomainList domains={tData.data} />
        <RecentList domains={recent.data} />
        <LatestBlog feed={feed} />
        <TwitterPosts />
      </div>
      {/* <div className="w-full mb-4 text-sm"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
            Investor Space
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {values.investorSpaceCount}
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
      </div> */}
      {/* Start:: Graph Chart */}
      <div className="w-full mb-4 text-sm"></div>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:gap-7.5">
        <div className="">
          <div className="">
            <ChartOne graph={graph} />
          </div>
        </div>
        <div className="">
          <div className="w-full">
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
        </div>
      </div>
      {/* End:: Graph Chart */}
    </>
  );
}
