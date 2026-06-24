import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaUsers, FaUserShield, FaEnvelopeOpenText, FaCircleCheck } from "react-icons/fa6";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardDataStats from "@/components/CardDataStats";
import AdminUnauthorized from "@/components/Admin/AdminUnauthorized";
import { requireAdmin, adminUserStats, listAutoresponders } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DNTrademark Admin - Admin Dashboard",
  description: "Manage users and email autoresponders.",
};

const AdminHome = async () => {
  const guard = await requireAdmin();
  if (!guard.ok) {
    if (guard.status === 401) redirect("/auth/signin");
    return <AdminUnauthorized />;
  }

  const [stats, autos] = await Promise.all([adminUserStats(), listAutoresponders()]);
  const activeAutos = autos.filter((a) => Number(a.is_active) === 1).length;

  return (
    <>
      <Breadcrumb pageName="Admin" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        <CardDataStats title="Total users" total={String(stats.total)} rate="">
          <FaUsers className="h-5 w-5" />
        </CardDataStats>
        <CardDataStats title="Admins" total={String(stats.admins)} rate="">
          <FaUserShield className="h-5 w-5 text-brand" />
        </CardDataStats>
        <CardDataStats title="Email opt-in" total={String(stats.emailable)} rate="">
          <FaEnvelopeOpenText className="h-5 w-5 text-meta-3" />
        </CardDataStats>
        <CardDataStats title="Active autoresponders" total={String(activeAutos)} rate="">
          <FaCircleCheck className="h-5 w-5 text-meta-3" />
        </CardDataStats>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/admin/users"
          className="group rounded-2xl border border-stroke/70 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-4 dark:border-strokedark/70 dark:bg-boxdark"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <FaUsers className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-black dark:text-white">User management</h3>
          <p className="text-sm text-body dark:text-bodydark">
            Create, edit, promote and remove platform users with full CRUD control.
          </p>
        </Link>

        <Link
          href="/admin/autoresponders"
          className="group rounded-2xl border border-stroke/70 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-4 dark:border-strokedark/70 dark:bg-boxdark"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <FaEnvelopeOpenText className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-black dark:text-white">Autoresponders</h3>
          <p className="text-sm text-body dark:text-bodydark">
            Build email automations sent through Amazon SES — welcome emails and broadcasts.
          </p>
        </Link>
      </div>
    </>
  );
};

export default AdminHome;
