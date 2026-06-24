'use client';

import Image from 'next/image';

import { AUTH_FEATURES, AUTH_COPY, type AuthFeature } from '@/components/Auth/authContent';

function FeatureIcon({ icon }: { icon: AuthFeature['icon'] }) {
  const className = 'h-5 w-5 shrink-0 text-brand-light';

  switch (icon) {
    case 'globe':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.7 21a2 2 0 01-3.4 0" />
        </svg>
      );
    case 'dashboard':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </svg>
      );
    case 'shield':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
  }
}

type AuthFeaturesPanelProps = {
  mode: 'signin' | 'signup';
};

export default function AuthFeaturesPanel({ mode }: AuthFeaturesPanelProps) {
  const copy = AUTH_COPY[mode];

  return (
    <aside className="auth-features-panel relative overflow-hidden">
      <div className="auth-features-glow pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="auth-features-glow pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-light/20 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between gap-8 p-6 sm:p-8 lg:p-12 xl:p-14">
        <div>
          <div className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-lg">
            <Image
              src="https://cdn.vnoc.com/logos/logo-dntrademark-final.png"
              alt="DNTrademark"
              width={160}
              height={28}
              priority
            />
          </div>

          <h2 className="mt-8 max-w-md text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {copy.panelTitle}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            {copy.panelSubtitle}
          </p>
        </div>

        <ul className="hidden space-y-4 lg:block">
          {AUTH_FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <FeatureIcon icon={feature.icon} />
              </div>
              <div>
                <p className="font-semibold text-white">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {AUTH_FEATURES.slice(0, 4).map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <FeatureIcon icon={feature.icon} />
              </div>
              <p className="text-xs font-semibold leading-snug text-white">{feature.title}</p>
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-6 border-t border-white/10 pt-6 text-sm text-white/70 lg:flex">
          <div>
            <p className="text-2xl font-bold text-white">24/7</p>
            <p>Automated monitoring</p>
          </div>
          <div className="h-10 w-px bg-white/15" />
          <div>
            <p className="text-2xl font-bold text-white">Global</p>
            <p>Trademark coverage</p>
          </div>
          <div className="h-10 w-px bg-white/15" />
          <div>
            <p className="text-2xl font-bold text-white">Real-time</p>
            <p>Hit notifications</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
