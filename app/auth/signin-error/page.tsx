import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

import { authPath, getAuthBaseUrl } from '@/lib/auth-url';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Sign In Error',
};

const ERROR_MESSAGES: Record<string, string> = {
  OAuthCallback:
    'Sign-in with Google or GitHub failed after the provider callback. Common causes: wrong OAuth callback URL on Google/GitHub, NEXTAUTH_URL mismatch, missing API credentials on the server, or the backend API rejected login/registration for your email.',
  OAuthSignin: 'Could not start the OAuth sign-in flow. Check provider credentials on the server.',
  OAuthCreateAccount: 'Could not create an OAuth account. Please try again or use email sign-in.',
  EmailCreateAccount: 'Could not create account with that email.',
  Callback: 'There was a problem completing sign-in. Please try again.',
  OAuthAccountNotLinked:
    'This email is already linked to another sign-in method. Use the same provider you signed up with.',
  AccessDenied: 'Sign-in was denied. Your account may not exist yet or the backend API rejected the login.',
  Configuration: 'Auth is misconfigured on the server (missing NEXTAUTH_SECRET, NEXTAUTH_URL, or OAuth keys).',
  Verification: 'The sign-in link is no longer valid.',
  Default: 'An unexpected error occurred during sign-in.',
};

export default function SignInErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const code = searchParams.error ?? 'Default';
  const message = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default;
  const baseUrl = getAuthBaseUrl();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="panel-card w-full max-w-md overflow-hidden shadow-4">
        <div className="border-b border-stroke/60 px-8 py-8 dark:border-strokedark/60">
          <Image
            src="https://cdn.vnoc.com/logos/logo-dntrademark-final.png"
            alt="Logo"
            width={176}
            height={32}
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-black dark:text-white">
            Sign-in error
          </h2>
          <p className="mt-2 text-sm text-body dark:text-bodydark">{message}</p>
          {code !== 'Default' && (
            <p className="mt-2 text-xs text-bodydark2">Error code: {code}</p>
          )}
        </div>
        <div className="space-y-3 px-8 py-8 text-sm text-body dark:text-bodydark">
          <p className="font-medium text-black dark:text-white">If you are an admin, verify:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <code className="text-xs">NEXTAUTH_URL={baseUrl}</code>
            </li>
            <li>
              Google callback:{' '}
              <code className="text-xs">{authPath('/api/auth/callback/google')}</code>
            </li>
            <li>
              GitHub callback:{' '}
              <code className="text-xs">{authPath('/api/auth/callback/github')}</code>
            </li>
            <li>API_URL and API_KEY reach api.dntrademark.com from production</li>
          </ul>
          <Link
            href="/auth/signin"
            className="btn-primary mt-4 inline-flex w-full justify-center"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
