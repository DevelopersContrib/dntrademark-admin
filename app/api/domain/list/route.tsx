import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(options);
    console.log('session', session);
    const config = {
      headers: { Authorization: 'Bearer ' + session?.token },
    };
    const apiUrl = process.env.API_URL + '/domains?api_key=' + process.env.API_KEY + '&filter=rdao&limit=4';
    console.log('apiUrl', apiUrl);

    const res = await axios.get(apiUrl, config);
    console.log('res.data', res.data);

    // return new Response(JSON.stringify({ test: 'test' }), { status: 201 });
  } catch (error) {
    console.log(error);
    return error;
  }
};
