export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { getAuthBaseUrl, authPath } from '@/lib/auth-url';

/** Dev-only: verify auth env + API before testing OAuth locally. */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const baseUrl = getAuthBaseUrl();
  const checks = {
    NEXTAUTH_URL: baseUrl,
    NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
    GOOGLE_ID: Boolean(process.env.GOOGLE_ID),
    GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    GITHUB_ID: Boolean(process.env.GITHUB_ID),
    GITHUB_SECRET: Boolean(process.env.GITHUB_SECRET),
    API_URL: process.env.API_URL ?? null,
    API_KEY: Boolean(process.env.API_KEY),
    googleCallback: authPath('/api/auth/callback/google'),
    githubCallback: authPath('/api/auth/callback/github'),
  };

  let apiReachable = false;
  let apiMessage = 'skipped';

  if (process.env.API_URL && process.env.API_KEY) {
    try {
      const res = await fetch(
        `${process.env.API_URL}/user/check?api_key=${process.env.API_KEY}&email=dev-check@local.test`,
        { signal: AbortSignal.timeout(10000) },
      );
      apiReachable = res.ok;
      apiMessage = `HTTP ${res.status}`;
    } catch (error) {
      apiMessage = error instanceof Error ? error.message : 'request failed';
    }
  }

  const ready =
    checks.NEXTAUTH_SECRET &&
    checks.GOOGLE_ID &&
    checks.GOOGLE_CLIENT_SECRET &&
    checks.API_URL &&
    checks.API_KEY &&
    apiReachable;

  return NextResponse.json({
    ready,
    checks,
    apiReachable,
    apiMessage,
    localTesting: {
      step1: `Open ${baseUrl}/auth/signin (not dash.dntrademark.com)`,
      step2: `Add to Google OAuth console → Authorized redirect URI: ${checks.googleCallback}`,
      step3: `Add to GitHub OAuth app → Callback URL: ${checks.githubCallback}`,
      step4: `Restart dev server after .env.local changes: rm -rf .next && pnpm dev`,
      step5: `Run ${baseUrl}/api/auth/dev-check to re-run this check`,
    },
  });
}
