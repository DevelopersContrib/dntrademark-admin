'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

import AuthDivider from '@/components/Auth/AuthDivider';
import OAuthButtons from '@/components/Auth/OAuthButtons';

export default function SigninForm() {
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOauthError(params.get('error'));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/user/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error ?? 'Sign in failed. Please try again.');
        return;
      }

      await signIn('credentials', { email, password, callbackUrl: '/' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      {oauthError && (
        <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          OAuth sign-in failed ({oauthError}).{' '}
          <Link href="/auth/signin-error" className="font-semibold underline">
            View details
          </Link>
        </div>
      )}

      <OAuthButtons mode="signin" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="input-modern"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-black dark:text-white">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            className="input-modern"
          />
        </div>

        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              Signing in…
            </span>
          ) : (
            'Sign in with email'
          )}
        </button>
      </form>
    </div>
  );
}
