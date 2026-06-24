export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const apiUrl = process.env.API_URL + '/user/save?api_key=' + process.env.API_KEY;

    const params = new URLSearchParams();
    params.append('first_name', data.firstName);
    params.append('last_name', data.lastName);
    params.append('email', data.email);
    params.append('password', data.password);

    const res = await axios.post(apiUrl, params);
    const result = res.data;

    return NextResponse.json(result.data ?? { success: true }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Sign up failed' }, { status: 500 });
  }
};
