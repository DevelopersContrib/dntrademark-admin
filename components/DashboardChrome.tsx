'use client';

import { useState } from 'react';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-whiten via-[#f8fafc] to-[#eef2ff]/40 dark:from-boxdark-2 dark:via-boxdark dark:to-black">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
