export const dynamic = 'force-dynamic';

import { getSessionUserId, insertMonitorDomains } from '@/lib/db-queries';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }

    // Accept either an array or a comma/newline-separated string.
    let names: string[] = [];
    if (Array.isArray(data.domains)) {
      names = data.domains.map((s: unknown) => String(s));
    } else if (typeof data.domains === 'string') {
      names = data.domains.split(/[\n,]/);
    }

    const result = await insertMonitorDomains(userId, names);
    return new Response(JSON.stringify({ success: true, ...result }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to add domains' }), { status: 500 });
  }
};
