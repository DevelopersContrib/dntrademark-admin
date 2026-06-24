export const dynamic = 'force-dynamic';

import { getSessionUserId, deleteDomains } from '@/lib/db-queries';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }

    const result = await deleteDomains(userId, data.domains);
    return new Response(JSON.stringify({ domains: result }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Request failed' }), { status: 500 });
  }
};
