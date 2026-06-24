export const dynamic = 'force-dynamic';

import { getSessionUserId, listMonitorDomains, getMonitorSummary } from '@/lib/db-queries';

export const POST = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }

    const [domains, summary] = await Promise.all([
      listMonitorDomains(userId),
      getMonitorSummary(userId),
    ]);

    return new Response(JSON.stringify({ domains, summary }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to load monitoring' }), { status: 500 });
  }
};
