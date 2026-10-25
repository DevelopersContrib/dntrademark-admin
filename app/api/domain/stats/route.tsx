export const dynamic = 'force-dynamic';

import { getSessionUserId } from '@/lib/db-queries';

export const GET = async () => {
  const userId = await getSessionUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
  }

  return new Response(JSON.stringify({ data: null }), { status: 200 });
};
