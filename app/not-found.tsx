import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-whiten p-6 dark:bg-boxdark-2">
      <div className="panel-card w-full max-w-md p-8 text-center shadow-4">
        <h1 className="text-xl font-bold text-black dark:text-white">Page not found</h1>
        <p className="mt-2 text-sm text-body dark:text-bodydark">
          The page you requested does not exist or has been moved.
        </p>
        <Link href="/auth/signin" className="btn-primary mt-6 inline-flex">
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
