import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/",
    "/pricing",
    "/onboarding",
    "/billing",
    "/settings",
    "/settings2",
    "/feedback",
    "/notifications",
    "/domains/:path*",
    "/checkout/:path*",
    "/invoices/:path*",
    "/items/:path*",
    "/calendar",
    "/chart",
    "/tables",
    "/forms/:path*",
    "/ui/:path*",
  ],
};
