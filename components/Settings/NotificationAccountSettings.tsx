"use client";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { details } from "@/types/details";
import { User } from "@/types/user";
import { countries } from "@/lib/contries";

export default function NotificationSettings(userDetails: any) {
  const { data: session } = useSession();
  const { allow_email, allow_sms, sms_number, sms_code } = userDetails.userdetails;
  const [emailOpt, setEmailOpt] = useState(allow_email);
  const [smsOpt, setSmsOpt] = useState(allow_sms);
  const [countryDialCode, setCountryDialCode] = useState(sms_code ? sms_code:'');
  const [smsNumber, setSmsNumber] = useState(sms_number ? sms_number:'');
  const [savingNotif, setSavingNotif] = useState(false);

  const handleEmailOptChange = (opt: boolean) => {
    setEmailOpt(opt);
  };

  const handleSmsOptChange = (opt: boolean) => {
    setSmsOpt(opt);
  };

  const handleCountryCodeChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setCountryDialCode(value);
  }

  const handleSmsNumberChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSmsNumber(value);
  }

  const validateSmsNumber = () => {
    const phoneNumber = countryDialCode + smsNumber;
    const phoneRegEx = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
    
    if (!phoneRegEx.test(phoneNumber)) {
      Swal.fire({
        title: 'Oops!',
        text: 'Invalid phone number format.',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    } else {
      saveNotificationSettings(phoneNumber);
    }
  }

  const saveNotificationSettings = async (phoneNumber: string) => {
    setSavingNotif(true);

    const response = await fetch('/api/user/update', {
      method: 'POST',
      body: JSON.stringify({ 
        allow_email:  emailOpt, 
        allow_sms:  smsOpt, 
        sms_code:  countryDialCode, 
        sms_number:  smsNumber, 
        token:session?.token  
      }),
    });

    const res = await response.json();

    if (res.success) {
      Swal.fire({
        title: 'Saved',
        text: 'Notification setting saved.',
        icon: 'success',
        confirmButtonText: 'Close'
      });
      setSavingNotif(false);
    } else {
      Swal.fire({
        title: 'Oops!',
        text: 'An error occured during saving. Please try again!',
        icon: 'error',
        confirmButtonText: 'Close'
      });
      setSavingNotif(false);
    }
  }

  useEffect(() => {
    
  }, []);
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
                checked={emailOpt ? true : false}
                onChange={() => handleEmailOptChange(true)}
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
                checked={!emailOpt ? true : false}
                onChange={() => handleEmailOptChange(false)}
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
                checked={smsOpt ? true : false}
                onChange={() => {
                  handleSmsOptChange(true);
                }}
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
                checked={!smsOpt ? true : false}
                onChange={() => {
                  handleSmsOptChange(false);
                }}
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
                <select 
                  className="relative z-20 w-full appearance-none rounded-lg border border-stroke dark:border-dark-3 bg-transparent py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                  defaultValue={countryDialCode}
                  onChange={(e) => handleCountryCodeChange(e)}
                >
                  <option value="" className="dark:bg-dark-2"></option>
                  {countries.map((country) => (
                    <option
                      key={country.code}
                      value={country.dial_code}
                      className="dark:bg-dark-2"
                    >
                      {`${country.code} (${country.dial_code})`}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 z-10 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-body-color"></span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4">
              <input
                className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                type="text"
                placeholder="Mobile Number"
                value={smsNumber}
                onChange={(e) => handleSmsNumberChange(e)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs`}
            onClick={() => validateSmsNumber()}
          >
          Save 
          </button>
        </div>
      </div>
    </>
  );
}
