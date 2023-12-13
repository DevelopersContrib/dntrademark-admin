'use client';
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import { FaCircleNotch } from 'react-icons/fa6';
import { InvoiceProps } from "@/types/invoice";

// Docs:: https://stripe.com/docs/payments/accept-a-payment-charges?client=react

async function stripeTokenHandler(token: any, pack_id: string) {
  const paymentData = { token: token.id, pack_id: pack_id };

  // Use fetch to send the token ID and any other payment data to your server.
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

  const res = await fetch('/api/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  // Return and display the result of the charge.
  // return response.json();
  return await res.json();
}

interface pack {
  pack: InvoiceProps;
}


const Invoice: React.FC<pack> = ({ pack }) => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Invoice Summary
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          {/* Start:: Notification if Successfully Paid */}
          <div className="mb-4 hidden">
            <div className="flex w-full rounded-lg border-l-[6px] border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md md:p-9">
              <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
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
                  {"Paid Successfully"}
                </h5>
              </div>
            </div>
          </div>
          {/* End:: Notification if Successfully paid */}

          {/* Start:: Table */}
          <div className="w-full table-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] table-th-header">Plan</th>
                  <th className="min-w-[150px] table-th-header">Amount</th>
                  <th className="min-w-[120px] table-th-header">Additional</th>
                  <th className="min-w-[120px] table-th-header">Status</th>
                  <th className="min-w-[120px] table-th-header">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {pack.desc}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      ${pack.package_amount}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      ${pack.additional_amount}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">
                      {pack.status}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">
                      {pack.due_date}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* End:: Table */}
        </div>
      </div>
      <div className="rounded-sm border border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="checkoutCard">
                <form >
                  <div className="mb-4">
                 
                  </div>
                  <button className="inline-flex w-full items-center justify-center rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" >
                   
                    Pay
                  </button>
                </form>
              </div>
            </div> 
    </>
  );
};

export default Invoice;
