import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import SigninForm from "@/components/Auth/SigninForm";

export const metadata: Metadata = {
  title: "DNTrademark Admin - SignIn",
  description:
    "dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.",
  // other metadata
};

const SignIn: React.FC = () => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full xl:w-[500px] mx-auto">
        <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-10">
              <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 items-center mb-8">
                <div>
                  <Image
                    className=""
                    src={"https://cdn.vnoc.com/logos/logo-dntrademark-final.png"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                </div>
                <div className="font-semibold text-xs">
                  Don&apos;t have any account? <a href="/auth/signup" className="inline-block text-primary">Sign Up</a>
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In
              </h2>

              <SigninForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
