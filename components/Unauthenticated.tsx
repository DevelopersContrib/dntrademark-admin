'use client';
import {signOut} from "next-auth/react";
function Unauthenticated() {
    setTimeout(async function(){
        const data = await signOut({redirect: false, callbackUrl: "/auth/signin"})
        window.location.reload()
    },1000) 
  return (
    <div>Session Expired!</div>
  )
}

export default Unauthenticated
