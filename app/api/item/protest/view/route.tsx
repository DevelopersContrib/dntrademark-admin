import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';
import { protest } from "@/types/protest";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: 'Bearer ' + session?.token },
    };

    const apiUrl = process.env.API_URL + '/items/protests/item-protest/'+data.id+'?api_key=' + process.env.API_KEY;
    
    const res = await axios.get(apiUrl, config);
    const itemProtest  = res.data.itemProtest as protest;
    return new Response(JSON.stringify({ item: res.data.itemProtest,content:itemProtest.content}), { status: 200 });
  } catch (error) {
    console.log(error);
    return error;
  }
};
