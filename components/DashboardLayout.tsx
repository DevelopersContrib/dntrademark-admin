'use client';

import DashboardChrome from '@/components/DashboardChrome';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark:text-bodydark">
      <DashboardChrome>{children}</DashboardChrome>
    </div>
  );
}
