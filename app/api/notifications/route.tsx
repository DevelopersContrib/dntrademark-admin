export const dynamic = 'force-dynamic';

import axios from 'axios';
import { NextResponse } from 'next/server';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const GET = async () => {
  try {
    const session = await getServerSession(options);

    if (!session?.token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url =
      process.env.API_URL + '/notifications?api_key=' + process.env.API_KEY;

    const res = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + session.token,
        'Content-Type': 'application/json',
      },
    });

    const body = res.data;
    if (body && typeof body === 'object' && Array.isArray(body.message)) {
      const hasNull = body.message.some((n: unknown) => n == null || typeof n !== 'object');
      const hasMissingUrl = body.message.some(
        (n: unknown) => n != null && typeof n === 'object' && !(n as Record<string, unknown>).url,
      );
      if (hasNull || hasMissingUrl) {
        console.warn('[notifications] items with null/missing fields detected');
      }
    }

    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
};
