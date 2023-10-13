'use client';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const DomainForm = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const schema = Yup.object().shape({
    domains: Yup.string().required('Please enter domains'),
  });

  const handleSubmitForm = async (values: { domains: string}) => {
    setError((prev) => '');
    const finalDomains = values.domains.split("\n");
    
    const res = await fetch('/api/domain/add', {
      method: 'POST',
      body: JSON.stringify({ domains:  finalDomains.join(","), token:session?.token  }),
    });

    const result = await res.json();

    console.log(result);
    if (!result.success) {
      setError(result.error);
    } else {
      setSuccess(result.message);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          domains: '',
        }}
        validationSchema={schema}
        onSubmit={(values: { domains: string }) => {
          setTimeout(() => {
            handleSubmitForm(values);
          }, 500);
        }}
      >
        {(formik) => (
          <Form>
        { success != "" ?
        <div className="mb-4">
        <div
          className="flex w-full rounded-lg border-l-[6px] border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md md:p-9"
        >
          <div
            className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]"
          >
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
</div>:null}
        <div className="font-medium leading-relaxed">
         </div>
         <ErrorMessage component="small" className="text-[rgb(220,53,69)]" name="domains" />
                {error != '' && (
                  <>
                    <small className="text-[rgb(220,53,69)]">{error}</small>
                  </>
                )}
         <div className="mb-2">
          Add Domains <small>(separate domain by new line)</small>
         </div>
         <Field name="domains" as="textarea" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
           <button type="submit" className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>Submit</button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default DomainForm;