export default function AuthFormSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      <div className="h-12 rounded-xl bg-stroke/40 dark:bg-strokedark/40" />
      <div className="h-11 rounded-xl bg-stroke/30 dark:bg-strokedark/30" />
      <div className="h-11 rounded-xl bg-stroke/30 dark:bg-strokedark/30" />
      <div className="h-12 rounded-xl bg-brand/20" />
    </div>
  );
}
