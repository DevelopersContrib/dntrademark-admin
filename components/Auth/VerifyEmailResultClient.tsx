'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const messages: Record<string, { title: string; body: string; success: boolean }> = {
  success: {
    title: 'Email verified!',
    body: 'Your email address has been confirmed. You can now sign in.',
    success: true,
  },
  already_verified: {
    title: 'Already verified',
    body: 'This email address was already verified. You can sign in.',
    success: true,
  },
  expired: {
    title: 'Link expired',
    body: 'This verification link has expired. Please sign in and request a new verification email.',
    success: false,
  },
  invalid: {
    title: 'Invalid link',
    body: 'This verification link is invalid or has already been used.',
    success: false,
  },
  signature_mismatch: {
    title: 'Invalid link',
    body: 'This verification link is invalid.',
    success: false,
  },
};

function VerifyEmailResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') ?? 'invalid';
  const info = messages[status] ?? messages.invalid;

  return (
    <div className="flex min-h-screen items-center justify-center bg-whiten px-4 dark:bg-boxdark-2">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-default dark:bg-boxdark">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            info.success ? 'bg-meta-3/10 text-meta-3' : 'bg-danger/10 text-danger'
          }`}
        >
          {info.success ? (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h1 className="mb-2 text-xl font-bold text-black dark:text-white">{info.title}</h1>
        <p className="mb-6 text-sm text-body dark:text-bodydark">{info.body}</p>

        <Link
          href="/auth/signin"
          className="btn-primary inline-block rounded-lg px-6 py-3 text-sm font-semibold"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailResultClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand border-r-transparent" />
        </div>
      }
    >
      <VerifyEmailResultContent />
    </Suspense>
  );
}
