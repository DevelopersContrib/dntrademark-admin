"use client";
import { useEffect, useState, use } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import React from "react";
import WelcomeNotif from "../Dashboard/WelcomeNotif";
import { domainTable } from "@/types/domainTable";
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
    investorSpaceCount:0
  };

  if (stats === undefined) {
  } else {
    initialStats = {
      domainsCount: stats.domainsCount,
      hitsCount: stats.hitsCount,
      noHitsCount: stats.noHitsCount,
      domainsAtRiskCount: stats.domainsAtRiskCount,
      investorSpaceCount:stats.investorSpaceCount
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
        <CardDataStats
          title="Domains at Risk"
          total={String(
            values.domainsAtRiskCount ? values.domainsAtRiskCount : 0
          )}
          rate=""
          levelUp
        >
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
      <div className="w-full mb-4 text-sm"></div>
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
      </div>
      {/* Start:: Graph Chart */}
      <div className="w-full mb-4 text-sm"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="hidden">
          <ChartOne />
          </div>
        </div>
      </div>
      {/* End:: Graph Chart */}
    </>
  );
}