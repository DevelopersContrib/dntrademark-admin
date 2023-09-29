'use client';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
function page() {
    const { data: session } = useSession();
    const [providers, setProviders] = useState<any>(null);
    const handleSubmit = async () => {debugger;
        signIn("credentials", 
            { email: 'row.none@gmail.com', password: 'ronan123', 
              firstName: 'ronan', lastName: 'li'
            })
      }
      useEffect(() => {
        (async () => {
          const res = await getProviders();
          setProviders(res);
        })();
      }, []);
  return (
    <>
    <div>Register</div>
    {session?.user ? (
                <button type='button' onClick={()=>{signOut()}} className='outline_btn'>
                  Sign Out {session?.user.email}
                </button>
              ) : (
            <button type="button" onClick={handleSubmit} aria-label="signup with email and password" className="inline-flex items-center gap-2.5 bg-black dark:bg-btndark hover:bg-blackho ease-in-out duration-300 font-medium text-white rounded-full px-6 py-3">
                      Create Account
            </button>
              )
            }
    </>
    
  )
}

export default page