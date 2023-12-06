import { NextResponse } from 'next/server';
import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: 'Bearer ' + session?.token },
    };

    const apiUrl = process.env.API_URL + '/items/protests/add?api_key=' + process.env.API_KEY;

    const params = new URLSearchParams();
    params.append('item_id', data.item_id);
    params.append('title', data.title);
    params.append('content', data.content);
 
    const res = await axios.post(apiUrl, params, config);
    const result = res.data;

    return NextResponse.json(result);
    // return new Response(JSON.stringify({ items: res.data.items}), { status: 200 });
  } catch (error) {
    console.log(error);
    return error;
  }
};