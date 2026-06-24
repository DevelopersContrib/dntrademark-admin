'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import AuthFeaturesPanel from '@/components/Auth/AuthFeaturesPanel';
import { AUTH_COPY } from '@/components/Auth/authContent';

type AuthSplitLayoutProps = {
  mode: 'signin' | 'signup';
  footer: {
    text: string;
    linkText: string;
    href: string;
  };
  children: ReactNode;
};

export default function AuthSplitLayout({ mode, footer, children }: AuthSplitLayoutProps) {
  const copy = AUTH_COPY[mode];

  return (
    <div className="auth-split-layout min-h-screen lg:grid lg:grid-cols-2">
      <AuthFeaturesPanel mode={mode} />

      <section className="auth-form-panel flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl">
              {copy.headline}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-body dark:text-bodydark sm:text-base">
              {copy.subheadline}
            </p>
          </div>

          {children}

          <p className="mt-8 text-center text-sm text-body dark:text-bodydark">
            {footer.text}{' '}
            <Link href={footer.href} className="font-semibold text-brand hover:underline">
              {footer.linkText}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
