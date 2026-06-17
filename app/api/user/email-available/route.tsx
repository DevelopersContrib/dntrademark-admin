export const dynamic = 'force-dynamic';

import axios from 'axios';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();
    const apiUrl =
      process.env.API_URL +
      '/user/check?api_key=' +
      process.env.API_KEY +
      '&email=' +
      email;

    const result = await axios.get(apiUrl, { timeout: 4000 });
    const isTaken = Boolean(result.data?.data?.data?.id);

    return NextResponse.json({ isEmailAvailable: !isTaken });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Email check failed' }, { status: 500 });
  }
};
