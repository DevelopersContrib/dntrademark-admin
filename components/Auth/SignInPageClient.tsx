'use client';

import AuthSplitLayout from '@/components/Auth/AuthSplitLayout';
import SigninForm from '@/components/Auth/SigninForm';

export default function SignInPageClient() {
  return (
    <AuthSplitLayout
      mode="signin"
      footer={{
        text: "Don't have an account?",
        linkText: 'Create one free',
        href: '/auth/signup',
      }}
    >
      <SigninForm />
    </AuthSplitLayout>
  );
}
