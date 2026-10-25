export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';
import { getSessionUserId } from '@/lib/db-queries';
import { query } from '@/lib/db';
import { kickScans } from '@/lib/scan-kick';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const token = data.token
    
    const headers = { 'Authorization': 'Bearer '+token };
    
    const apiUrl = process.env.API_URL + '/domains/add?api_key=' + process.env.API_KEY;

    const params = {
      domains: data.domains,
      add_domain: data.add_domain
    }
 
    const res = await axios.post(apiUrl, params, { headers });
    const result = res.data;

    // After the external API inserts domains, kick scans for any of
    // this user's domains that still have no_of_items NULL (unscanned).
    const userId = await getSessionUserId();
    if (userId) {
      const unscanned = await query<{ id: number; domain_name: string }>(
        'SELECT id, domain_name FROM domains WHERE user_id = ? AND no_of_items IS NULL',
        [userId],
      );
      kickScans(unscanned);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
  }
};