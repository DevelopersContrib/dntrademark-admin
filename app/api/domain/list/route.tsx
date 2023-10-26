import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

// export const GET = async (req: Request) => {
//   try {
export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    console.log('data:',data)
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: 'Bearer ' + session?.token },
    };

    const apiUrl = process.env.API_URL + '/domains?api_key=' + process.env.API_KEY + '&filter='+data.search+'&limit='+data.limit+'&page='+data.page;
    console.log('apiUrl',apiUrl)
    const res = await axios.get(apiUrl, config);
    console.log('res.data.domains',res.data.domains)
    return new Response(JSON.stringify({ domains: res.data.domains }), { status: 200 });
  } catch (error) {
    console.log(error);
    return error;
  }
};
