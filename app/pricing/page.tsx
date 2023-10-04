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

async function Page() {
  const plans = await getPackages();
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {plans.data.map((plan: PackagesProps) => (
            <Packages key={plan.id} {...plan} />
        ))}
      </div>

    </>
  )
}

export default Page