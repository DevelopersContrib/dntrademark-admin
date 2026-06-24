import PackagesNew from "@/components/Pricing/PackagesNew";
import { getUser } from "@/lib/data";

async function Page() {
  const userdetails = await getUser();

  return (
    <PackagesNew {...userdetails} />
  );
}

export default Page;
