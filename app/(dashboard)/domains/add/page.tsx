"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Tabs from '@/components/onboarding/Tabs';
import DomainForm from '@/components/onboarding/DomainForm';
import UploadForm from '@/components/onboarding/UploadForm';
import UpgradeBanner from '@/components/Dashboard/UpgradeBanner';
import { getPlan } from '@/lib/domain-helper';
import type { UserPlan } from '@/lib/plan';

const Page = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [plan, setPlan] = useState<UserPlan | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await getPlan();
      if (res?.plan) setPlan(res.plan);
    })();
  }, []);

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  const limitReached = !!plan?.limitReached;

  return (
    <div className="flex flex-col gap-6">
      {plan ? <UpgradeBanner plan={plan} force={limitReached} /> : null}

      <div
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Add Domains
          </h3>
        </div>
        {limitReached ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <h4 className="text-lg font-semibold text-black dark:text-white">
              You&apos;ve reached your plan limit
            </h4>
            <p className="max-w-md text-sm text-body dark:text-bodydark">
              {plan?.end_limit != null
                ? `Your plan includes ${plan.end_limit} domains and you're using ${plan.used}.`
                : ''}{' '}
              Upgrade your plan to add and monitor more domains.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90"
            >
              Upgrade plan
            </Link>
          </div>
        ) : (
        <div className="mb-4 p-7.5 w-full">
          <div
            className="mb-7.5 flex flex-wrap gap-3 rounded-lg border border-stroke py-3 px-4 dark:border-strokedark">
            <button
              className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => handleTabClick(1)}
            >
              Add Domains
            </button>
            <button
              className={`bg-gray dark:bg-meta-4 text-black dark:text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-danger hover:text-white dark:hover:bg-danger md:text-base lg:px-6 nav-tabs ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => handleTabClick(2)}
            >
              Upload Domains
            </button>

          </div >
          <div>
            {
              activeTab === 1
              &&
              <Tabs>
                <DomainForm></DomainForm>
              </Tabs>
            }

            {
              activeTab === 2
              &&
              <Tabs>
                <UploadForm></UploadForm>
              </Tabs>
            }
          </div>
        </div >
        )}
      </div >
    </div>
  )
}

export default Page