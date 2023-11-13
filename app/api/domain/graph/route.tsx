import { NextResponse } from 'next/server';
import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from "next-auth/next"

export const GET = async (req: Request) => {

  try {
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: 'Bearer ' + session?.token },
      timeout: 10000
    };
    const limit:number=10, page:number=1, sortBy:string='domain_name', orderBy:string='ASC', filter:string=''

    const apiUrl = process.env.API_URL + '/domains/historical-hits/?api_key=' + process.env.API_KEY;
    // const apiUrl = process.env.API_URL + '/domains?api_key=' + process.env.API_KEY + 
    //   '&filter='+filter+'&limit='+limit+'&page='+page+'&sortBy='+sortBy+'&orderBy='+orderBy
    console.log('apiUrl',apiUrl)
    const res = await axios.get(apiUrl, config);

     const result = res.data;
     console.log('result',result)
     NextResponse.json(result);
    
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({result:null});
};