"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthCard from "@/components/Auth/AuthCard";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // swallow — always show generic message
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-boxdark-2">
      <AuthCard
        title="Forgot password?"
        subtitle="Enter your email and we'll send you a link to reset your password."
      >
        {submitted ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              If an account exists for that email, we&apos;ve sent a reset link. Check your inbox
              (and spam folder).
            </div>
            <Link href="/auth/signin" className="btn-primary inline-flex w-full justify-center py-3.5">
              Back to sign in
            </Link>
          </div>
        ) : (
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-modern"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  Sending…
                </span>
              ) : (
                "Send reset link"
              )}
            </button>

            <p className="text-center text-sm text-body dark:text-bodydark">
              Remember your password?{" "}
              <Link href="/auth/signin" className="font-semibold text-brand hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
