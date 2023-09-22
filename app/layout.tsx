'use client';
import './globals.css';
import './data-tables-css.css';
import './satoshi.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Loader from '@/components/common/Loader';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

import { getUser } from '@/lib/user';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState(searchParams.get('token'));

  const retrieveUserData = async () => {
    const res = await getUser(token);

    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
      setLoading(false);
    } else {
      window.location.href = 'https://www.dntrademark.com/';
    }
  };

  useEffect(() => {
    retrieveUserData();
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? (
            <Loader />
          ) : (
            <div className="flex h-screen overflow-hidden">
              {/* <!-- ===== Sidebar Start ===== --> */}
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              {/* <!-- ===== Sidebar End ===== --> */}

              {/* <!-- ===== Content Area Start ===== --> */}
              <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* <!-- ===== Header Start ===== --> */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* <!-- ===== Header End ===== --> */}

                {/* <!-- ===== Main Content Start ===== --> */}
                <main>
                  <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{children}</div>
                </main>
                {/* <!-- ===== Main Content End ===== --> */}
              </div>
              {/* <!-- ===== Content Area End ===== --> */}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
