"use client"
import { PackagesProps } from "@/types/packages";
import { useEffect, useState } from "react";
import Packages from "@/components/Pricing/Packages";
const Page = () => {

  const [plans, setPlans] = useState<PackagesProps[]>([]);

  const getPackages = async () => {
    try {
      const res = await fetch('api/package', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      setPlans(result.data)

      // console.log(result.data);

    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  useEffect(() => {
    getPackages();
  }, []);


  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Start:: Pricing Item */}
        {plans.map((plan: PackagesProps) => (
          <Packages key={plan.id} {...plan} />
        ))}

      </div>
    </>
  )
}

export default Page;