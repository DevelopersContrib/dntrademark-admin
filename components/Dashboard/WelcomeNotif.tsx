import { signOut, useSession, getProviders } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const ucfirst = (str: string) => {
  if (str != null){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }else {
    return 'User';
  }
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
      <div className="w-full mb-4">
        <h2>🎉Welcome Back {ucfirst(session?.user.name!)}</h2>
      </div>
    ) : null
  );
};

export default WelcomeNotif;
