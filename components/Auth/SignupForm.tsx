'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

import AuthDivider from '@/components/Auth/AuthDivider';
import OAuthButtons from '@/components/Auth/OAuthButtons';

export default function SignupForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== rePassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!res.ok) {
        setError('Could not create your account. That email may already be registered.');
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
      <OAuthButtons mode="signup" />
      <AuthDivider label="or register with email" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-black dark:text-white">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Jane"
              className="input-modern"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-black dark:text-white">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Doe"
              className="input-modern"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="input-modern"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-black dark:text-white">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Min. 6 characters"
              className="input-modern"
            />
          </div>
          <div>
            <label htmlFor="rePassword" className="mb-2 block text-sm font-medium text-black dark:text-white">
              Confirm password
            </label>
            <input
              id="rePassword"
              type="password"
              autoComplete="new-password"
              required
              value={rePassword}
              onChange={(event) => setRePassword(event.target.value)}
              placeholder="Repeat password"
              className="input-modern"
            />
          </div>
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
              Creating account…
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </div>
  );
}
