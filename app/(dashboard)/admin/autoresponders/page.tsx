import { Metadata } from "next";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminUnauthorized from "@/components/Admin/AdminUnauthorized";
import AutoResponders from "@/components/Admin/AutoResponders";
import { requireAdmin } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DNTrademark Admin - Autoresponders",
  description: "Manage email autoresponders sent via Amazon SES.",
};

const AutorespondersPage = async () => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    if (guard.status === 401) redirect("/auth/signin");
    return <AdminUnauthorized />;
  }

  return (
    <>
      <Breadcrumb pageName="Autoresponders" />
      <AutoResponders defaultTestEmail={guard.user.email} />
    </>
  );
};

export default AutorespondersPage;
