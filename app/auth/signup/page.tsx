import { Metadata } from 'next';

import SignUpPageClient from '@/components/Auth/SignUpPageClient';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Sign Up',
  description:
    'Create an account to monitor your domains against global trademark databases.',
};

export default function SignUpPage() {
  return <SignUpPageClient />;
}
