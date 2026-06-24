'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-whiten p-6 dark:bg-boxdark-2">
      <div className="panel-card w-full max-w-md p-8 text-center shadow-4">
        <h1 className="text-xl font-bold text-black dark:text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-body dark:text-bodydark">
          An unexpected error occurred. You can try again or return to sign in.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/auth/signin" className="btn-oauth-secondary">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
