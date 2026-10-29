import { Metadata } from "next";
import VerifyEmailResultClient from "@/components/Auth/VerifyEmailResultClient";

export const metadata: Metadata = {
  title: "DNTrademark - Email Verification",
  description: "Email verification result",
};

export default function VerifyEmailResultPage() {
  return <VerifyEmailResultClient />;
}
