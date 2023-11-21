'use client';
import {signOut} from "next-auth/react";
function Unauthenticated() {
    setTimeout(async function(){
        const data = await signOut({redirect: false, callbackUrl: "/auth/signin"})
        window.location.reload()
    },800) 
  return (
    <div></div>
  )
}

export default Unauthenticated
