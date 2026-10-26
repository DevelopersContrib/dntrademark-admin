import { Metadata } from "next";

import ForgotPasswordClient from "@/components/Auth/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "DNTrademark Admin - Forgot Password",
  description: "Request a password reset link for your DNTrademark account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
