export const dynamic = 'force-dynamic';

import { getSessionUserId } from '@/lib/db-queries';
import { queryOne } from '@/lib/db';
import { scanDomain } from '@/lib/scan';
import { isUsptoConfigured } from '@/lib/uspto';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const userId = await getSessionUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
    }
    if (!isUsptoConfigured()) {
      return new Response(JSON.stringify({ error: 'USPTO API not configured' }), { status: 503 });
    }

    const domainId = Number(data.id);
    const domain = await queryOne<{ id: number; domain_name: string }>(
      'SELECT id, domain_name FROM domains WHERE id = ? AND user_id = ? LIMIT 1',
      [domainId, userId],
    );
    if (!domain) {
      return new Response(JSON.stringify({ error: 'Domain not found' }), { status: 404 });
    }

    const result = await scanDomain(domain.id, domain.domain_name);
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Scan failed' }), { status: 500 });
  }
};
