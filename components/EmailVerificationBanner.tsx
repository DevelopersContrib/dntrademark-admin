'use client';

import { useCallback, useEffect, useState } from 'react';

type Status = 'loading' | 'verified' | 'unverified' | 'sending' | 'sent';

export default function EmailVerificationBanner() {
  const [status, setStatus] = useState<Status>('loading');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/verification-status')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setStatus(d.verified ? 'verified' : 'unverified');
      })
      .catch(() => {
        if (!cancelled) setStatus('verified');
      });
    return () => { cancelled = true; };
  }, []);

  const resend = useCallback(async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      setStatus(res.ok ? 'sent' : 'unverified');
    } catch {
      setStatus('unverified');
    }
  }, []);

  if (status === 'loading' || status === 'verified' || dismissed) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning dark:border-warning/40 dark:bg-warning/5">
      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <span className="flex-1">
        {status === 'sent'
          ? 'Verification email sent — check your inbox.'
          : 'Your email address is not yet verified.'}
      </span>

      {status === 'unverified' && (
        <button
          onClick={resend}
          className="whitespace-nowrap font-medium underline hover:no-underline"
        >
          Resend verification email
        </button>
      )}

      {status === 'sending' && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-warning border-r-transparent" />
      )}

      <button
        onClick={() => setDismissed(true)}
        className="ml-1 text-warning/60 hover:text-warning"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
