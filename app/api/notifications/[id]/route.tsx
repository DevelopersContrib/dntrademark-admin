export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(options);
    const url =
      process.env.API_URL + '/notifications/' + params.id + '?api_key=' + process.env.API_KEY;

    const res = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + session?.token,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(res.data.message, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch notification' }, { status: 500 });
  }
};
