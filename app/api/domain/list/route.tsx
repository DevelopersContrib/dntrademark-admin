export const dynamic = 'force-dynamic';

import { getSessionUserId, listDomains } from '@/lib/db-queries';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }

    const domains = await listDomains(userId, {
      filter: data.search,
      limit: data.limit,
      page: data.page,
      sortBy: data.sortBy,
      orderBy: data.orderBy,
    });

    return new Response(JSON.stringify({ domains }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch domains' }), { status: 500 });
  }
};
