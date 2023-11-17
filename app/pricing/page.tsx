/*
"use client"
import { PackagesProps } from "@/types/packages";
import { useEffect, useState } from "react";
import Packages from "@/components/Pricing/Packages";
import { Metadata } from 'next';
import { FaCircleNotch } from 'react-icons/fa6'

const Page = () => {

  const [plans, setPlans] = useState<PackagesProps[]>([]);

  const [loading, setLoading] = useState(true);

  const getPackages = async () => {
    try {
      const res = await fetch('api/package', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      setPlans(result.data);
      setLoading(false);

      // console.log(result.data);

    } catch (error) {
      console.log(`Error: ${error}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    getPackages();
  }, []);


  return (
    <>
      {// Start:: Pricing Item}
      {
        loading ?
          <div className="w-full min-h-[50vh] flex items-center justify-center">
            <FaCircleNotch className="fa-spin text-4xl text-[rgb(117_118_147)]" />
          </div>
          :
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            {plans.map((plan: PackagesProps) => (
              <Packages key={plan.id} {...plan} />
            ))}
          </div>
      }
    </>
  )
}

export default Page;

*/

import { getPackages } from '@/lib/data';
import { PackagesProps } from "@/types/packages";
import Packages from "@/components/Pricing/Packages";
import Image from "next/image";

async function Page() {
  const plans = await getPackages();
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5" style={{display: "none"}}>
        {plans.data.map((plan: PackagesProps) => (
            <Packages key={plan.id} {...plan} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h3 className="text-black dark:text-white font-bold text-3xl xl:text-title-xxl mb-2.5">
            FREE
            <span className="text-regular text-[rgb(117_118_147)] dark:text-manatee block leading-[35px] text-lg">
              forever
            </span>
          </h3>
          <h4 className="text-black dark:text-white font-medium text-2xl mb-2.5">
            Explorer Plan
          </h4>
          <h6 className="text-black dark:text-white font-medium text-1xl mb-1.5">
            &#9632;&nbsp;Free 3 Domains
          </h6>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Benefits:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b> Trademark Notifications:</b> Stay informed on trademarks related to your domains.
          </div>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b> Basic Analytics:</b> Track key insights on your domains.
          </div>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b> Community Access:</b> Engage with fellow domain enthusiasts.
          </div>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Ideal For:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-5.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            &nbsp;Individual domain investors exploring the world of trademarks.
          </div>
          <Image className='mx-auto' style={{right: "15px",top: "15px"}}
              width={200}
              height={200}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-1.png"}
              alt="Plan Image 1"
            />
          <button style={{position: "absolute",right: "15px",bottom: "15px"}} type="submit" className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>
            Activate
          </button>
        </div>

        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h3 className="text-black dark:text-white font-bold text-3xl xl:text-title-xxl mb-2.5">
            $99.00
            <span className="text-regular text-[rgb(117_118_147)] dark:text-manatee block leading-[35px] text-lg">
              per month
            </span>
          </h3>
          <h4 className="text-black dark:text-white font-medium text-2xl mb-2.5">
            Professional Plan
          </h4>
          <h6 className="text-black dark:text-white font-medium text-1xl mb-1.5">
            &#9632;&nbsp;Free 2000 Domains and $.08 cents/domain after
          </h6>
          <h6 className="text-black dark:text-white font-medium text-1xl mb-1.5">
            &#9632;&nbsp;For Individuals:
          </h6>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Everything in Explorer, Plus:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b> Advanced Trademark Notifications:</b> Comprehensive notifications for nuanced insights.
          </div>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b> Priority Support:</b> Fast-track assistance from our support team.
          </div>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Ideal For:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            &nbsp;Serious individual domain investors.
          </div>
          <h6 className="text-black dark:text-white font-medium text-1xl mb-1.5">
            &#9632;&nbsp;For Small Teams:
          </h6>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Everything in Explorer for Each Team Member, Plus:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b> Dedicated Team Workspace:</b> Enhanced collaboration features for effective team management.
          </div>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            <b> Priority Support:</b> Quick assistance for uninterrupted workflows.
          </div>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Ideal For:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            &nbsp;Small to medium-sized teams requiring advanced features.
          </div>
          <Image className='mx-auto' style={{position: "absolute",right: "15px",top: "15px"}}
              width={150}
              height={150}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-2.png"}
              alt="Plan Image 2"
            />
          <div className='mb-3'>&nbsp;</div>
          <button style={{position: "absolute",right: "15px",bottom: "15px"}} type="submit" className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>
            Activate
          </button>
        </div>

        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h3 className="text-black dark:text-white font-bold text-3xl xl:text-title-xxl mb-2.5">
            $199.00
            <span className="text-regular text-[rgb(117_118_147)] dark:text-manatee block leading-[35px] text-lg">
              per month
            </span>
          </h3>
          <h4 className="text-black dark:text-white font-medium text-2xl mb-2.5">
            Enterprise Plan
          </h4>
          <h6 className="text-black dark:text-white font-medium text-1xl mb-1.5">
            &#9632;&nbsp;Free 4000 Domains and $0.06 cents/domain after
          </h6>
          <h6 className="text-black dark:text-white font-medium text-1xl mb-1.5">
            &#9632;&nbsp;For Corporations:
          </h6>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Dedicated Account Manager: A designated expert for personalized support.</p>
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;API Access: Integrate DNTrademark.com with your existing systems.</p>          
          <p className='text-primary font-medium'>&nbsp;&nbsp;&#9633;&nbsp;Ideal For:</p>
          <div
            aria-label="purchase this plan"
            className="inline-flex1 items-center gap-2.5 text-dark dark:text-white dark:hover:text-primary font-medium transition-all duration-300 mb-1.5"
          >            
            &nbsp;&nbsp;<svg className="inline-flex"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                fill="currentColor"
              />
            </svg>
            &nbsp;Corporations managing extensive domain portfolios.
          </div> 
          <Image className='mx-auto' style={{right: "15px",top: "15px",border: "none"}}
              width={250}
              height={250}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-3.png"}
              alt="Plan Image 3"
            />         
          <button style={{position: "absolute",right: "15px",bottom: "15px"}} type="submit" className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>
            Activate
          </button>
        </div>

      </div>
    </>
  )
}

export default Page