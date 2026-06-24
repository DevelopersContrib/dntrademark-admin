import { Metadata } from "next";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminUnauthorized from "@/components/Admin/AdminUnauthorized";
import AdminUsers from "@/components/Admin/AdminUsers";
import { requireAdmin } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DNTrademark Admin - User Management",
  description: "Manage platform users.",
};

const AdminUsersPage = async () => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    if (guard.status === 401) redirect("/auth/signin");
    return <AdminUnauthorized />;
  }

  return (
    <>
      <Breadcrumb pageName="User Management" />
      <AdminUsers currentAdminId={guard.user.id} />
    </>
  );
};

export default AdminUsersPage;
