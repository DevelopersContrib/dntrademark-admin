import './globals.css';
import './data-tables-css.css';
import './satoshi.css';

import AuthProvider from '@/app/context/AuthProvider';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
