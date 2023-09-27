import React from 'react'
import { getPlans } from '@/lib/data';

export default async function Page() {
  const plans = await getPlans();
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Start:: Pricing Item */}
        {plans.data.data.map((plan:any) => (
        <div key={plan.id} className="group relative bg-white dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-black p-7.5 xl:p-12.5">
          <h3 className="text-black dark:text-white font-bold text-3xl xl:text-title-xxl mb-7.5">
          ${plan.price}{" "}
            <span className="text-regular text-[rgb(117_118_147)] dark:text-manatee block leading-[55px] text-lg">
              /month
            </span>
          </h3>
          <h4 className="text-black dark:text-white font-medium text-2xl mb-2.5">
          {plan.name}
          </h4>
          <p className='text-[rgb(117_118_147)]'>Good for {plan.start_limit} to  {plan.end_limit} Domains</p>

          <div className="border-t border-stroke dark:border-black mt-9 pt-9 pb-12.5">
            {plan.description}
          </div>

          <div
            aria-label="purchase this plan"
            className="inline-flex items-center gap-2.5 text-primary dark:text-white dark:hover:text-primary font-medium transition-all duration-300"
          >
            <a href={`/checkout/${plan.id}`} className="hover:pr-2 duration-500"><button type='button' className="hover:pr-2 duration-500"> Activate</button></a>
            <svg
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
          </div>
        </div>
        ))}
      </div>
    </>
  )
}