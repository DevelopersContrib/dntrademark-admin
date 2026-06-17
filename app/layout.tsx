import './globals.css';
import './data-tables-css.css';
import './satoshi.css';

import AuthProvider from '@/app/context/AuthProvider';
import LayoutShell from '@/components/LayoutShell';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
