'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'loading' | 'verified' | 'unverified' | 'sending' | 'sent' | 'error';

const COOLDOWN_MS = 60_000;

export default function EmailVerificationBanner() {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = useCallback(() => {
    const end = Date.now() + COOLDOWN_MS;
    setCooldownLeft(Math.ceil(COOLDOWN_MS / 1000));

    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      const remaining = Math.ceil((end - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownLeft(0);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      } else {
        setCooldownLeft(remaining);
      }
    }, 1000);
  }, []);

  const resend = useCallback(async () => {
    setStatus('sending');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      if (res.ok) {
        setStatus('sent');
        startCooldown();
      } else {
        let msg = "We couldn't send the email right now. Please try again later.";
        try {
          const body = await res.json();
          if (body?.error && typeof body.error === 'string') msg = body.error;
        } catch { /* use fallback */ }
        setErrorMsg(msg);
        setStatus('error');
        startCooldown();
      }
    } catch {
      setErrorMsg("We couldn't send the email right now. Please try again later.");
      setStatus('error');
      startCooldown();
    }
  }, [startCooldown]);

  if (status === 'loading' || status === 'verified' || dismissed) return null;

  const isError = status === 'error';
  const borderColor = isError
    ? 'border-red-500/30 dark:border-red-500/40'
    : 'border-warning/30 dark:border-warning/40';
  const bgColor = isError
    ? 'bg-red-500/10 dark:bg-red-500/5'
    : 'bg-warning/10 dark:bg-warning/5';
  const textColor = isError ? 'text-red-600 dark:text-red-400' : 'text-warning';

  return (
    <div className={`mb-4 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${borderColor} ${bgColor} ${textColor}`}>
      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <span className="flex-1">
        {status === 'sent' && 'Verification email sent — check your inbox (and spam).'}
        {status === 'error' && (errorMsg || "We couldn't send the email right now. Please try again later.")}
        {(status === 'unverified') && 'Your email address is not yet verified.'}
        {status === 'sending' && 'Sending verification email…'}
      </span>

      {(status === 'unverified' || status === 'sent' || status === 'error') && (
        <button
          onClick={resend}
          disabled={cooldownLeft > 0}
          className="whitespace-nowrap font-medium underline hover:no-underline disabled:pointer-events-none disabled:opacity-50"
        >
          {cooldownLeft > 0
            ? `Resend (${cooldownLeft}s)`
            : 'Resend verification email'}
        </button>
      )}

      {status === 'sending' && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}

      <button
        onClick={() => setDismissed(true)}
        className="ml-1 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
