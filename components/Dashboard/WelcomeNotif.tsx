import { signOut, useSession, getProviders } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const ucfirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const WelcomeNotif = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    session?.user ? (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
          Hi Welcome Back {ucfirst(session?.user.name!)}!
        </div>
      </div>
    ) : null
  );
};

export default WelcomeNotif;
