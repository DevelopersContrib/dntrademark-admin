import { Metadata } from 'next';

import SignInPageClient from '@/components/Auth/SignInPageClient';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Sign In',
  description:
    'Sign in to monitor your domains against global trademark databases.',
};

export default function SignInPage() {
  return <SignInPageClient />;
}
