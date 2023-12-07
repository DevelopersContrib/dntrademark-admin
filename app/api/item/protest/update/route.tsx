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

    const apiUrl = process.env.API_URL + '/items/protests/update/'+data.id+'?api_key=' + process.env.API_KEY;
    data.token = session?.token;
    
    console.log('data..', data);

    const res = await axios.put(apiUrl, data, config);
    const result = res.data;
    return NextResponse.json(result);
  } catch (error) {
    console.log("ERRORR");
    console.log(error);
    return error;
  }
};