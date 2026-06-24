import { Metadata } from 'next';
import Link from 'next/link';
import DomainReport from "@/components/Domains/DomainReport";
import Unauthenticated from '@/components/Unauthenticated';
import { getDomainReport } from '@/lib/data';
import { getSessionUserId } from '@/lib/db-queries';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Report',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
};

const page = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id, 10);

  const userId = await getSessionUserId();
  if (!userId) {
    return <Unauthenticated />;
  }

  const report = await getDomainReport(id);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-stroke bg-white px-6 py-20 text-center dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-xl font-semibold text-black dark:text-white">Domain not found</h2>
        <p className="mt-2 text-sm text-body dark:text-bodydark">
          This domain doesn&rsquo;t exist or isn&rsquo;t in your account.
        </p>
        <Link
          href="/domains/all"
          className="mt-5 inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Back to all domains
        </Link>
      </div>
    );
  }

  return <DomainReport report={report} />;
};

export default page;
