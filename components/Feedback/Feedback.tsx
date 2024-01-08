"use client";
import React, { useEffect, useState } from "react";

import { FaGithub, FaCircleNotch } from 'react-icons/fa6';

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Feedback() {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address.")
      .required("Enter your email address."),
    name: Yup.string().required("What is your name?").min(3),
    message: Yup.string().required("Enter your message.").min(3),
  });

  // const handleSubmitFeedback = async (values: { email: string, name: string, message: string }) => {
  //   const res = await fetch("/api/feedback/save", {
  //     method: "POST",
  //     body: JSON.stringify(values)
  //   });
  
  //   const result = await res.json();
  
  //   if (res.ok) {
  //     setIsSaved(true);
      
  //     setTimeout(() => {
  //       setIsSaved(false);
  //       // Reset the form after a successful submission
  //       formik.resetForm();
  //     }, 2000);
  //   }
  
  //   setIsSaving(false);
  // }
  return (
    <>
      <div className="w-full lg:max-w-[600px] lg:mx-auto">
          {
            isSaved && (
              <div className="flex w-full rounded-lg border-l-[6px] border-[#00B078] bg-[#C4F9E2] bg-opacity-[100%] px-7 py-8 shadow-md md:p-9 mb-8">
                <div className="w-full">
                  <h5 className="mb-3 text-lg font-semibold text-[#004434]">
                    Thank you
                  </h5>
                  <p className="text-base leading-relaxed text-body-color">
                    for submitting your feedback.
                  </p>
                </div>
              </div>
            )
          }
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-bold text-black dark:text-white text-base">
              Feedback
            </h3>
          </div>
          <Formik
            initialValues={{
              email: "",
              name: "",
              message: "",
            }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setIsSaving(true);
          
              const res = await fetch("/api/feedback/save", {
                method: "POST",
                body: JSON.stringify(values),
              });
          
              const result = await res.json();
          
              if (res.ok) {
                setIsSaved(true);
          
                setTimeout(() => {
                  setIsSaved(false);
                  // Reset the form after a successful submission
                  resetForm();
                }, 2000);
              }
          
              setIsSaving(false);
              setSubmitting(false);
            }}
          >
          {(formik) => (
            <Form>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div className="mb-5">
                  <label htmlFor="">Email</label>
                  <Field
                    type="text"
                    className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                    name="email"
                  />
                </div>
                <ErrorMessage component="small" className="text-[rgb(220,53,69)]" name="email" />
                <div className="mb-5">
                  <label htmlFor="">Name</label>
                  <Field
                    type="text"
                    className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                    name="name"
                  />
                </div>
                <ErrorMessage component="small" className="text-[rgb(220,53,69)]" name="name" />
                <div className="mb-5">
                  <label htmlFor="">Message</label>
                  <Field
                    as="textarea"
                    rows={3}
                    className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 p-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                    name="message"
                  >
                  </Field>
                  <ErrorMessage component="small" className="text-[rgb(220,53,69)]" name="message" />
                </div>
                {
                  !isSaving ? (
                    <button type="submit" className="bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#1B44C8] hover:border-[#1B44C8] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#1B44C8] active:border-[#1B44C8] w-full">
                      Submit
                    </button>
                  ) : (
                    <button type="submit" className="bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#1B44C8] hover:border-[#1B44C8] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#1B44C8] active:border-[#1B44C8] w-full">
                      <FaCircleNotch className="w-4 h-4 fa-spin mr-2" /> Saving...
                    </button>
                  )
                }
                
              </div>
            </Form>
          )}
          </Formik>
        </div>
      </div>
    </>
  );
}
