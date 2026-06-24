import Link from "next/link";
import { FaLock } from "react-icons/fa6";

const AdminUnauthorized = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-stroke/70 bg-white p-10 text-center shadow-card dark:border-strokedark/70 dark:bg-boxdark">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <FaLock className="h-6 w-6" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Admins only
        </h2>
        <p className="mb-6 text-sm text-body dark:text-bodydark">
          You don&apos;t have permission to view the admin dashboard. If you
          believe this is a mistake, contact a system administrator.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminUnauthorized;
