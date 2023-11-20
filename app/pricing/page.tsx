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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        {plans.data.map((plan: PackagesProps) => (
            <Packages key={plan.id} {...plan} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h2 className="mb-5 text-[32px] font-bold text-black dark:text-white">
            Explorer Plan
          </h2>
          <p className="mb-4 pb-4 text-base text-body-color dark:text-dark-6">
          Domain investors venturing into the realm of trademarks.
          </p>
          <h2 className="mb-5 text-[52px] font-bold text-black dark:text-white rounded-md text-center" style={{background: "#DBEAFE",padding: "1.5rem 1rem 1rem"}}>
            <span>Free</span>
            <span className="text-base font-medium text-body-color dark:text-dark-6">
            &nbsp;Forever
            </span>
          </h2> 
          <div className='inline-flex mb-1.5'>
            <Image className='mx-auto pt-1' style={{height: "18px", width: "15px"}}
                width={0}
                height={0}
                src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
                alt="Check Icon"
              />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0">
              &nbsp;&nbsp;Free 3 domains
            </h6>       
          </div><br></br>
          <div className='inline-flex mb-1.5'>
            <Image className='mx-auto pt-1' style={{height: "18px", width: "15px"}}
                width={0}
                height={0}
                src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
                alt="Check Icon"
              />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0">
              &nbsp;&nbsp;For Starters:
            </h6>       
          </div> 
          <p className='text-primary font-medium'>Benefits:</p>
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
          <p className='text-primary font-medium'>Ideal For:</p>
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
          <Image className='mx-auto' style={{position: "absolute",right: "5px",top: "0px"}}
              width={100}
              height={100}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-1.png"}
              alt="Plan Image 1"
            />
          <button type="submit" className='block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-opacity-90'
          style={{position: "absolute",right: "0",bottom: "35px",left:"0", margin: "30px auto 0",width: "255px"}}
          >            
            Current
          </button>
        </div>



        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h2 className="mb-5 text-[32px] font-bold text-black dark:text-white">
            Professional Plan
          </h2>
          <p className="mb-4 pb-4 text-base text-body-color dark:text-dark-6">
          Devoted individual domain investors committed to their endeavors.
          </p>
          <h2 className="mb-5 text-[52px] font-bold text-black dark:text-white rounded-md text-center" style={{background: "#DBEAFE",padding: "1.5rem 1rem 1rem"}}>
            <span>$99</span>
            <span className="text-base font-medium text-body-color dark:text-dark-6">
            / year
            </span>
          </h2>   
          <div className='inline-flex mb-1.5'>
            <Image className='mx-auto pt-1' style={{height: "18px", width: "15px"}}
                width={0}
                height={0}
                src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
                alt="Check Icon"
              />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0">
              &nbsp;&nbsp;Free 2000 Domains and $.08 cents/domain after
            </h6>       
          </div><br></br>
          <div className='inline-flex mb-1.5'>
            <Image className='mx-auto pt-1' style={{height: "18px", width: "15px"}}
                width={0}
                height={0}
                src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
                alt="Check Icon"
              />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0">
              &nbsp;&nbsp;For Individuals:
            </h6>       
          </div>     
          <p className='text-primary font-medium'>Everything in Explorer, Plus:</p>
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
            <b> Advanced Trademark Notifications:Advanced Trademark Notifications:</b> Comprehensive notifications for nuanced insights.
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
          <p className='text-primary font-medium'>Ideal For:</p>
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
            &nbsp;Individual domain investors with a strong commitment to their endeavors.
            &nbsp;<a href="" className='text-primary'>&rarr;&nbsp;More</a>
          </div>                        
          <div style={{display: "none"}}>
            <div className='inline-flex mb-1.5'>
              <Image className='mx-auto pt-1' style={{height: "18px", width: "15px"}}
                  width={0}
                  height={0}
                  src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
                  alt="Check Icon"
                />
              <h6 className="text-black dark:text-white font-medium text-1xl mb-0">
                &nbsp;&nbsp;For Small Teams:
              </h6>       
            </div>     
            <p className='text-primary font-medium'>Everything in Explorer for Each Team Member, Plus:</p>
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
            <p className='text-primary font-medium'>Ideal For:</p>
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
              &nbsp;Small to medium-sized teams requiring advanced features.
            </div>
          </div>  
          <div className='mb-5'>&nbsp;</div>  
          <Image className='mx-auto' style={{position: "absolute",right: "5px",top: "0px"}}
              width={100}
              height={100}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-2.png"}
              alt="Plan Image 2"
            />
          <button type="submit" className='block w-full rounded-md border border-stroke dark:border-dark-3 bg-transparent p-3 text-center text-base font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white'
          style={{position: "absolute",right: "0",bottom: "35px",left:"0", margin: "30px auto 0",width: "255px"}}
          >
            Activate
          </button>
        </div>



        <div className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h2 className="mb-5 text-[32px] font-bold text-black dark:text-white">
            Enterprise Plan
          </h2>
          <p className="mb-4 pb-4 text-base text-body-color dark:text-dark-6">
          Corporations efficiently handling large and diverse domain portfolios.
          </p>
          <h2 className="mb-5 text-[52px] font-bold text-black dark:text-white rounded-md text-center" style={{background: "#DBEAFE",padding: "1.5rem 1rem 1rem"}}>
            <span>$199</span>
            <span className="text-base font-medium text-body-color dark:text-dark-6">
            / year
            </span>
          </h2>   
          <div className='inline-flex mb-1.5'>
            <Image className='mx-auto pt-1' style={{height: "18px", width: "15px"}}
                width={0}
                height={0}
                src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
                alt="Check Icon"
              />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0">
              &nbsp;&nbsp;Free 4000 Domains and $0.06 cents/domain after
            </h6>       
          </div><br></br>
          <div className='inline-flex mb-1.5'>
            <Image className='mx-auto pt-1' style={{height: "18px", width: "15px"}}
                width={0}
                height={0}
                src={"https://cdn.vnoc.com/desc/dntrademark/dn-check.png"}
                alt="Check Icon"
              />
            <h6 className="text-black dark:text-white font-medium text-1xl mb-0">
              &nbsp;&nbsp;For Corporations:
            </h6>       
          </div>     
          <p className='text-primary font-medium'>Dedicated Account Manager: A designated expert for personalized support.</p>
          <p className='text-primary font-medium'>API Access: Integrate DNTrademark.com with your existing systems.</p>
          <p className='text-primary font-medium'>Ideal For:</p>
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
            &nbsp;Corporations managing extensive domain portfolios.
          </div>
          <Image className='mx-auto' style={{position: "absolute",right: "5px",top: "0px"}}
              width={100}
              height={100}
              src={"https://cdn.vnoc.com/desc/dntrademark/dn-monitor-lizard-3b.png"}
              alt="Plan Image 3"
            />
          <button type="submit" className='block w-full rounded-md border border-stroke dark:border-dark-3 bg-transparent p-3 text-center text-base font-medium text-primary transition hover:border-primary hover:bg-primary hover:text-white'
          style={{position: "absolute",right: "0",bottom: "35px",left:"0", margin: "30px auto 0",width: "255px"}}
          >
            Activate
          </button>
        </div>
        

      </div>
    </>
  )
}

export default Page