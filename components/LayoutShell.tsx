'use client';

import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import Loader from '@/components/common/Loader';

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [DashboardChrome, setDashboardChrome] =
    useState<ComponentType<{ children: ReactNode }> | null>(null);

  const isAuthRoute = pathname?.startsWith('/auth');

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (isAuthRoute) {
      setDashboardChrome(null);
      return;
    }

    import('@/components/DashboardChrome').then((mod) => {
      setDashboardChrome(() => mod.default);
    });
  }, [isAuthRoute]);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (loading || !DashboardChrome) {
    return (
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <Loader />
      </div>
    );
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <DashboardChrome>{children}</DashboardChrome>
    </div>
  );
}
