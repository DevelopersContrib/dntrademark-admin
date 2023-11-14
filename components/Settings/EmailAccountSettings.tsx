"use client";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { details } from "@/types/details";
import { checkEmail } from "@/lib/data";

import dynamic from "next/dynamic";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

export default function EmailAccountSettings(userdetails: any) {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);
  const userEmail = userdetails as details;
  const userInfo = userEmail.userdetails;

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address.")
      .required("Enter your email address."),
  });

  const handleClick = async (values: { email: string }) => {
    setError((prev) => "");
    setUpdating(true);
    const res = await checkEmail(values.email);
    if (!res?.isEmailAvailable) {
      setError("Email is already taken!");
      setUpdating(false);
    } else {
      const updated = await fetch("/api/user/update", {
        method: "POST",
        body: JSON.stringify({ email: values.email, token: session?.token }),
      });

      const result = await updated.json();

      console.log(result);
      if (!result.success) {
        setError(result.error);
        setUpdating(false);
      } else {
        setSuccess("You successfully updated your email! Signing out...");
        setUpdating(false);
        setTimeout(() => {
          signOut();
        }, 600);
      }
    }

    if (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "Close",
      });
      setError("");
    }
  };

  useEffect(() => {
    console.log('userEmail', userEmail);
  },[])

  return (
    <>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={schema}
        onSubmit={(values: { email: string }) => {
          setTimeout(() => {
            handleClick(values);
          }, 500);
        }}
      >
        {(formik) => (
          <Form>
            <div className="mb-8">
              <div className="flex w-full rounded-lg border-l-[6px] border-[#FFBD24] bg-[#FEF6E1] px-4 py-6">
                <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#FDBD2C]">
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
                    After confirming your new email, you will be logged out. You
                    can use the new email to log in after that.
                  </p>
                </div>
              </div>
            </div>
            {success != "" ? (
              <div className="mb-4">
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
                      {success}
                    </h5>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="font-medium leading-relaxed"></div>
            <ErrorMessage
              component="small"
              className="text-[rgb(220,53,69)]"
              name="domains"
            />
            {error != "" && (
              <>
                <small className="text-[rgb(220,53,69)]">{error}</small>
              </>
            )}
            <div className="mb-4">
              <label
                htmlFor=""
                className="mb-3 block text-base font-medium text-black"
              >
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
            <div className="mb-4">
              <label
                htmlFor=""
                className="mb-3 block text-base font-medium text-black"
              >
                New Email Address
              </label>

              <Field
                type="text"
                name="email"
                className="border-[#ddd] text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]"
              />
              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
              <ErrorMessage
                component="small"
                className="text-[rgb(220,53,69)]"
                name="email"
              />
            </div>
            <button
              type="submit"
              className="bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
