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

    const apiUrl = process.env.API_URL + '/domains/items/'+data.id+'?api_key=' + process.env.API_KEY + 
      '&filter='+data.search+'&limit='+data.limit+'&page='+
      data.page+'&sortBy='+data.sortBy+'&orderBy='+data.orderBy;
    
    const res = await axios.get(apiUrl, config);
    

    return new Response(JSON.stringify({ items: res.data.items}), { status: 200 });
  } catch (error) {
    console.log(error);
    return error;
  }
};
