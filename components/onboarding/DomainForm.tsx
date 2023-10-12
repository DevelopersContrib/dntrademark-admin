'use client';
import { useEffect, useRef, useState } from "react";
import { signOut, useSession, getProviders } from "next-auth/react";
import ErrorBlock from './ErrorBlock';

const DomainForm= () => {
  const initialValues = {
		isLoading:false,
		isSuccess:false
	}

  const initialErrors = {
		validate:false,
		domainError: "",
	};

    const { data: session } = useSession();
    const [data, setData] = useState(initialValues);
    const [domains, setDomains] = useState("");
    const [result, setResult] = useState<any>();
    const [providers, setProviders] = useState<any>(null);
    const [errors, setErrors] = useState(initialErrors);

    useEffect(() => {
      const validateErrors = () => {
        const dataErrors = {
          domainError: (domains==''?"Please enter domains":"") ,
        }
        setErrors(dataErrors);
      }
      validateErrors()
    }, [data]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
      ): Promise<void> => {
        e.preventDefault();

        const isValid = !Object.values(errors).some(v => v);
        setErrors({ ...errors, ['validate']: true })
        const formData = new URLSearchParams();
        formData.append("domains", domains);
        console.log(session?.user)
        fetch("/api/domain/add", {
          body: formData.toString(),
          method: "post",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }).then(async (result) => {
          setResult(await result.json());
          setData({ ...data, ['isSuccess']: true});
        });
      };


    return (
        <>
        { data.isSuccess ?
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
                        Message Sent Successfully
                      </h5>
                      <p className="text-base leading-relaxed text-body-color">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      </p>
                    </div>
                  </div>
          </div>:null}
          {errors.validate? (<ErrorBlock msg={errors.domainError} />): null}
          <div className="font-medium leading-relaxed">
         </div>
         <div className="mb-2">
          Add Domains <small>(separate domain by new line)</small>
         </div>
         <form onSubmit={handleSubmit}>
         <textarea value={domains}
          onChange={(e) => setDomains(e.target.value)} className="border-form-stroke text-body-color placeholder-body-color focus:border-primary active:border-primary w-full rounded-lg border-[1.5px] py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-[#F5F7FD]" rows={5}></textarea>
          <button type="submit" className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>Submit</button>
          </form>
        </>
      )
    
};
export default DomainForm;