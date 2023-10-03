// Without a defined matcher, this one line applies next-auth 
// to the entire project
/*
export { default } from "next-auth/middleware"

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/extra","/dashboard"] }
*/

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = { matcher: ["/","/extra","/dashboard","/pricing"] }