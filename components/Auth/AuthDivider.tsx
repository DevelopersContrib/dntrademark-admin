'use client';

type AuthDividerProps = {
  label?: string;
};

export default function AuthDivider({ label = 'or continue with email' }: AuthDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-stroke dark:border-strokedark" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-bodydark2 dark:bg-boxdark">
          {label}
        </span>
      </div>
    </div>
  );
}
