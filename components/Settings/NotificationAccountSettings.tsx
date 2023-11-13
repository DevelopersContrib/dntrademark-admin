"use client";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { details } from "@/types/details";
import { User } from "@/types/user";

export default function NotificationSettings(userdetails: any) {
  const { data: session } = useSession();

  return (
    <>
      <div className="mb-4">
        <h4 className="mb-2 font-semibold">Turn on E-mail notification?</h4>
        <div className="flex space-x-4">
          <label
            htmlFor="notificationEmail-yes"
            className="flex items-center cursor-pointer select-none text-dark dark:text-white space-x-2"
          >
            <div className="relative">
              <input
                type="radio"
                id="notificationEmail-yes"
                name="notificationEmail"
              />
            </div>
            <span>Yes</span>
          </label>
          <label
            htmlFor="notificationEmail-no"
            className="flex items-center cursor-pointer select-none text-dark dark:text-white space-x-2"
          >
            <div className="relative">
              <input
                type="radio"
                id="notificationEmail-no"
                name="notificationEmail"
              />
            </div>
            <span>No</span>
          </label>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="mb-2 font-semibold">Turn on SMS notification?</h4>
        <div className="flex space-x-4">
          <label
            htmlFor="notificationSms-yes"
            className="flex items-center cursor-pointer select-none text-dark dark:text-white space-x-2"
          >
            <div className="relative">
              <input
                type="radio"
                id="notificationSms-yes"
                name="notificationSms"
              />
            </div>
            <span>Yes</span>
          </label>
          <label
            htmlFor="notificationSms-no"
            className="flex items-center cursor-pointer select-none text-dark dark:text-white space-x-2"
          >
            <div className="relative">
              <input
                type="radio"
                id="notificationSms-no"
                name="notificationSms"
              />
            </div>
            <span>No</span>
          </label>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="mb-2 font-semibold">
          For SMS, please enter your mobile number:
        </h4>
        <div className="inline-flex gap-4">
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="relative z-20">
                <select className="relative z-20 w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2">
                  <option value="" className="dark:bg-dark-2">
                    +63
                  </option>
                  <option value="" className="dark:bg-dark-2">
                    Option
                  </option>
                  <option value="" className="dark:bg-dark-2">
                    Option
                  </option>
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Mobile Number"
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
