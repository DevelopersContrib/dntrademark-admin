export const dynamic = 'force-dynamic';

import { getSessionUserId, getUserPlan } from '@/lib/db-queries';

export const POST = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }
    const plan = await getUserPlan(userId);
    return new Response(JSON.stringify({ plan }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to load plan' }), { status: 500 });
  }
};
