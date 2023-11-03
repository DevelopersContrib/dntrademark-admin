import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
          const session = await getServerSession(options);
          const config = {
            headers: { Authorization: 'Bearer ' + session?.token },
            data:{domains:data.domains},
          };
      
          const apiUrl = process.env.API_URL + '/domains/delete?api_key=' + process.env.API_KEY;
          const res = await axios.delete(apiUrl, config);
          return new Response(JSON.stringify({ domains: res.data }), { status: 200 });
        } catch (error) {
          console.log(error);
          return error;
        }
};
