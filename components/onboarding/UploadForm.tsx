'use client';
import React, { useState, useRef } from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import Papa, { ParseResult } from "papaparse"
import ErrorBlock from './ErrorBlock';


const UploadForm= () => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [providers, setProviders] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [values, setValues] = useState<any>(null);
  
  interface DataItem {
    domain: string;
  }
  
  const handleUploadCSV = () => {
    setUploading(true);

    const reader = new FileReader();

    const fileInput = inputRef.current;
    if (fileInput && fileInput.files) {
      const filesArray = Array.from(fileInput.files);
      const [file] = filesArray;

      reader.onloadend = async ({target}) => {
        if (target) {
          const csv = Papa.parse(target.result as string, { header: true });
     
          const csvData: any = csv.data;
          const newCSVData = csvData as DataItem[];
          const valuesAr: string[] = [];

          for(var x=0;x<newCSVData.length;x++){
            if(newCSVData[x].domain!=="") valuesAr.push(newCSVData[x].domain);
          }
          
          const finalDomains = valuesAr.join(",");
          const res = await fetch('/api/domain/add', {
            method: 'POST',
            body: JSON.stringify({ domains:  finalDomains, token:session?.token  }),
          });
      
          const result = await res.json();
      
          console.log(result);
          if (!result.success) {
            setError(result.error);
            setUploading(false);
          } else {
            setSuccess(result.message);
            setUploading(false);
          }
        }
      };
  
      reader.readAsText(file);
    }
  };

  return (
    <div>
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
{error? (<ErrorBlock msg={error} />): null}
        <div className="font-medium leading-relaxed">
         </div>
      <h4 className="page-header mb-4">Upload a CSV</h4>
      <div className="mb-4">
      <input ref={inputRef} disabled={uploading} type="file" name="file-input" className="form-control" />
      </div>
      <button
        onClick={handleUploadCSV}
        disabled={uploading}
        className='bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
    
};

UploadForm.propTypes = {};

export default UploadForm;