import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthCardProps = {
  title: string;
  subtitle: string;
  footer?: {
    text: string;
    linkText: string;
    href: string;
  };
  children: ReactNode;
};

export default function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <div className="panel-card w-full max-w-md overflow-hidden shadow-4">
      <div className="border-b border-stroke/60 px-8 py-8 dark:border-strokedark/60">
        <Image
          src="https://cdn.vnoc.com/logos/logo-dntrademark-final.png"
          alt="DNTrademark"
          width={176}
          height={32}
          priority
        />
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-black dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-body dark:text-bodydark">{subtitle}</p>
      </div>

      <div className="px-8 py-8">
        {footer && (
          <p className="mb-6 text-sm text-body dark:text-bodydark">
            {footer.text}{' '}
            <Link href={footer.href} className="font-semibold text-brand hover:underline">
              {footer.linkText}
            </Link>
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
