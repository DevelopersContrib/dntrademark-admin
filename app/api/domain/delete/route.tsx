export const dynamic = 'force-dynamic';

import { getSessionUserId, deleteDomains, MAX_DELETE_BATCH } from '@/lib/db-queries';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }

    const ids: unknown = data.domains;
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: 'domains must be a non-empty array of ids' }), { status: 400 });
    }
    if (ids.length > MAX_DELETE_BATCH) {
      return new Response(
        JSON.stringify({ error: `Too many ids (max ${MAX_DELETE_BATCH})` }),
        { status: 400 },
      );
    }

    const result = await deleteDomains(userId, ids as number[]);
    return new Response(JSON.stringify({ domains: result }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Request failed' }), { status: 500 });
  }
};
