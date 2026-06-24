import { useSession } from "next-auth/react";

const ucfirst = (str: string) => {
  if (str != null) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return "User";
};

const WelcomeNotif = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="mb-6 rounded-2xl border border-brand/20 bg-gradient-to-r from-brand/10 via-white to-white px-6 py-5 shadow-card dark:border-brand/30 dark:from-brand/10 dark:via-boxdark dark:to-boxdark">
      <p className="text-sm font-medium text-brand-dark dark:text-brand-light">
        Welcome back
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-black dark:text-white">
        {ucfirst(session.user.name ?? "User")}
      </h2>
      <p className="mt-2 text-sm text-body dark:text-bodydark">
        Here&apos;s an overview of your trademark monitoring activity.
      </p>
    </div>
  );
};

export default WelcomeNotif;
