"use client";
import { PackagesProps } from "@/types/packages";
import React from "react";

const Packages = (props: PackagesProps) => {
  return (
    <div
      key={props.id}
      className={`group flex flex-col relative dark:bg-black rounded-lg shadow-solid-10 dark:shadow-none border  dark:border-black p-7.5 xl:p-12.5 ${
        props.id === props.userPlanId
          ? "border-primary bg-[#e9f3ff]"
          : "border-stroke bg-white"
      }`}
    >
      <h4 className="text-black dark:text-white font-medium text-2xl mb-8 text-center">
        {props.name}
      </h4>
      <h3 className="text-black dark:text-white font-bold text-3xl xl:text-title-xxl mb-7.5 text-center">
        <span className="text-primary">
          <span className="text-xl">$</span>
          {props.price}
          <span className="text-base text-[rgb(117_118_147)] dark:text-white font-normal">
            /Mon
          </span>
        </span>
      </h3>
      <p className="text-black text-center mb-14">
        Good for {props.start_limit} to {props.end_limit} Domains
      </p>

      <div
        aria-label="purchase this plan"
        className="inline-flex items-center gap-2.5 text-primary dark:text-white dark:hover:text-primary font-medium transition-all duration-300"
      >
        {props.id !== 1 && (
          <>
            <a
              href={`/checkout/${props.id}`}
              className={`flex w-full justify-center items-center border border-[#ddd] py-2 rounded-md space-x-4 hover:bg-primary hover:text-white hover:border-primary
              ${props.id === props.userPlanId ? "disabled" : ""}`}
              onClick={(e) =>
                props.id === props.userPlanId && e.preventDefault()
              }
            >
              <span>
                {props.id === props.userPlanId ? "Current" : "Activate"}
              </span>

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
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Packages;
