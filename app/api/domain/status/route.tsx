export const dynamic = 'force-dynamic';

import { getSessionUserId, getMonitorStatuses } from '@/lib/db-queries';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }

    const ids: number[] = Array.isArray(data.ids) ? data.ids.map((n: unknown) => Number(n)) : [];
    const statuses = await getMonitorStatuses(userId, ids);

    return new Response(JSON.stringify({ statuses }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch status' }), { status: 500 });
  }
};
