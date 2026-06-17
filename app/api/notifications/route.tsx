export const dynamic = 'force-dynamic';

import axios from 'axios';
import { NextResponse } from 'next/server';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const GET = async () => {
  try {
    const session = await getServerSession(options);
    const url =
      process.env.API_URL + '/notifications?api_key=' + process.env.API_KEY;

    const res = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + session?.token,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
};
