import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Sign In Error',
};

const ERROR_MESSAGES: Record<string, { heading: string; body: string }> = {
  OAuthAccountNotLinked: {
    heading: 'Email already registered',
    body: 'This email is already registered with a password. Please sign in with your email and password. If you forgot it, use Forgot password.',
  },
  OAuthCallback: {
    heading: "Sign-in didn't work",
    body: 'Something went wrong while completing your Google or GitHub sign-in. Please try again.',
  },
  OAuthSignin: {
    heading: "Couldn't start sign-in",
    body: 'We were unable to start the sign-in process. Please try again in a moment.',
  },
  OAuthCreateAccount: {
    heading: 'Account creation failed',
    body: 'We could not create your account through Google or GitHub. Please try again or sign up with your email.',
  },
  EmailCreateAccount: {
    heading: 'Account creation failed',
    body: 'We could not create an account with that email. It may already be registered.',
  },
  Callback: {
    heading: "Sign-in didn't work",
    body: 'There was a problem completing sign-in. Please try again.',
  },
  AccessDenied: {
    heading: "Couldn't sign you in",
    body: "We weren't able to sign you in. Your account may not exist yet — try creating one, or sign in with a different method.",
  },
  Configuration: {
    heading: 'Sign-in temporarily unavailable',
    body: 'Sign-in is temporarily unavailable due to a server issue. Please try again later.',
  },
  Verification: {
    heading: 'Link expired',
    body: 'This sign-in link is no longer valid. Please request a new one.',
  },
  Default: {
    heading: "Sign-in didn't work",
    body: 'Something unexpected happened. Please try again or sign in with your email and password.',
  },
};

export default function SignInErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const code = searchParams.error ?? 'Default';
  const { heading, body } = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default;
  const isAccountNotLinked = code === 'OAuthAccountNotLinked';

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="panel-card w-full max-w-md overflow-hidden shadow-4">
        <div className="px-8 py-8">
          <Image
            src="https://cdn.vnoc.com/logos/logo-dntrademark-final.png"
            alt="Logo"
            width={176}
            height={32}
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-black dark:text-white">
            {heading}
          </h2>
          <p className="mt-2 text-sm text-body dark:text-bodydark">{body}</p>

          <div className="mt-6 space-y-3">
            <Link
              href="/auth/signin"
              className="btn-primary inline-flex w-full justify-center"
            >
              Sign in with email
            </Link>
            {isAccountNotLinked && (
              <Link
                href="/auth/forgot-password"
                className="inline-flex w-full justify-center text-sm font-medium text-brand hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
