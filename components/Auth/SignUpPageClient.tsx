'use client';

import AuthSplitLayout from '@/components/Auth/AuthSplitLayout';
import SignupForm from '@/components/Auth/SignupForm';

export default function SignUpPageClient() {
  return (
    <AuthSplitLayout
      mode="signup"
      footer={{
        text: 'Already have an account?',
        linkText: 'Sign in',
        href: '/auth/signin',
      }}
    >
      <SignupForm />
    </AuthSplitLayout>
  );
}
