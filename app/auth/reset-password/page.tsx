import { Metadata } from "next";

import ResetPasswordClient from "@/components/Auth/ResetPasswordClient";

export const metadata: Metadata = {
  title: "DNTrademark Admin - Reset Password",
  description: "Set a new password for your DNTrademark account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
