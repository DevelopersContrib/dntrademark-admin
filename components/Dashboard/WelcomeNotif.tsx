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
      <div className="w-full mb-4 text-sm">
        Welcome Back {ucfirst(session?.user.name!)},
      </div>
    ) : null
  );
};

export default WelcomeNotif;
