'use client';
import Swal from 'sweetalert2'
import React, { useEffect, useState  } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import {details} from "@/types/details";
import { checkEmail } from '@/lib/data';


import dynamic from "next/dynamic";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

export default function EmailAccountSettings(userdetails: any)  {
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const userEmail = userdetails as details;
  const userInfo = userEmail.userdetails ;


  const handleInput = (e: any) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
  
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }
  
  const handleClick = async (e:any) => {
    e.preventDefault();
    setError((prev) => '');
    console.log(formData.email)
    if (formData.email==''){
        setError('Please enter email address');
    }else {
      
      const res = await checkEmail(formData.email); 
      console.log(res?.isEmailAvailable)
      
      if (!res?.isEmailAvailable){
        setError('Email is already taken by another user!');
      }


    }

    if (error != ""){
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
   }
  }

  
 
  
  return (
    <>
      <div className="mb-8">
        <div
          className="flex w-full rounded-lg border-l-[6px] border-[#FFBD24] bg-[#FEF6E1] px-4 py-6"
        >
          <div
            className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#FDBD2C]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.0156 11.6156L10.9969 1.93125C10.5188 1.28437 9.78752 0.91875 9.00002 0.91875C8.18439 0.91875 7.45314 1.28437 7.00314 1.93125L0.984395 11.6156C0.421895 12.375 0.33752 13.3594 0.759395 14.2031C1.18127 15.0469 2.02502 15.5813 2.98127 15.5813H15.0188C15.975 15.5813 16.8188 15.0469 17.2406 14.2031C17.6625 13.3875 17.5781 12.375 17.0156 11.6156ZM16.1156 13.6406C15.8906 14.0625 15.4969 14.3156 15.0188 14.3156H2.98127C2.50315 14.3156 2.10939 14.0625 1.88439 13.6406C1.68752 13.2188 1.71564 12.7406 1.99689 12.375L8.01564 2.69062C8.24064 2.38125 8.60627 2.18437 9.00002 2.18437C9.39377 2.18437 9.75939 2.35312 9.9844 2.69062L16.0031 12.375C16.2844 12.7406 16.3125 13.2188 16.1156 13.6406Z"
                fill="white"
                stroke="white"
              />
              <path
                d="M8.9999 6.15002C8.6624 6.15002 8.35303 6.43127 8.35303 6.79689V9.86252C8.35303 10.2 8.63428 10.5094 8.9999 10.5094C9.36553 10.5094 9.64678 10.2281 9.64678 9.86252V6.76877C9.64678 6.43127 9.3374 6.15002 8.9999 6.15002Z"
                fill="white"
                stroke="white"
              />
              <path
                d="M8.9999 11.25C8.6624 11.25 8.35303 11.5313 8.35303 11.8969V12.0375C8.35303 12.375 8.63428 12.6844 8.9999 12.6844C9.36553 12.6844 9.64678 12.4031 9.64678 12.0375V11.8688C9.64678 11.5313 9.3374 11.25 8.9999 11.25Z"
                fill="white"
                stroke="white"
              />
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-1 text-base font-semibold text-[#9D5425]">
              Change Email Address
            </h5>
            <p className="text-sm leading-relaxed text-[#D0915C]">
              After confirming your new email, you will be logged out. You can use the new email to log in after that.
            </p>
          </div>
        </div>

      </div>

      <div className="mb-4">
        <label htmlFor="" className="mb-3 block text-base font-medium text-black">
          Current Email Address
        </label>
        <input
          type="text"
          name="email"
          value={userInfo.email}
          disabled
          className="border-[#ddd] text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]"
        />
      </div>

      <div className="mb-12">
        <label htmlFor="" className="mb-3 block text-base font-medium text-black">
          New Email Address
        </label>
        <input
          type="text"
          onChange={handleInput}
          name="email"
          className="border-[#ddd] text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]"
        />
      </div>

      <div className="mb-5">
        <button
          onClick={handleClick}
          type="button"
          className="bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Save Changes
        </button>
      </div>
    </>
  )
}

