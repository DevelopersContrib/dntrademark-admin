import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
});

/** Keep error redirects on the same host the user is actually browsing (localhost vs production). */
function redirectAuthError(req: NextRequest, error: string) {
  const url = req.nextUrl.clone();
  url.pathname = '/auth/signin-error';
  url.search = `?error=${encodeURIComponent(error)}`;
  return NextResponse.redirect(url);
}

export default function middleware(req: NextRequest, event: Parameters<typeof authMiddleware>[1]) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === '/api/auth/signin' && searchParams.has('error')) {
    return redirectAuthError(req, searchParams.get('error') ?? 'Default');
  }

  if (pathname === '/api/auth/error' && searchParams.has('error')) {
    return redirectAuthError(req, searchParams.get('error') ?? 'Default');
  }

  return authMiddleware(req as Parameters<typeof authMiddleware>[0], event);
}

export const config = {
  matcher: [
    '/api/auth/signin',
    '/api/auth/error',
    '/',
    '/pricing',
    '/onboarding',
    '/billing',
    '/settings',
    '/settings2',
    '/feedback',
    '/notifications',
    '/domains/:path*',
    '/checkout/:path*',
    '/invoices/:path*',
    '/items/:path*',
    '/calendar',
    '/chart',
    '/tables',
    '/forms/:path*',
    '/ui/:path*',
  ],
};
