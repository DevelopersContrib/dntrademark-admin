import { NextResponse } from 'next/server';
import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from "next-auth/next"

export const GET = async (req: Request) => {
  try {

    // const session = await getServerSession(options)

    // const config = {
    //   headers:{ 'Authorization': 'Bearer '+session?.token }
    // };
    
    // const apiUrl = process.env.API_URL + '/domains/stats?api_key=' + process.env.API_KEY;

    
    // const res = await axios.get(apiUrl, config)
    // const result = res.data.data;
    const result = ''

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
};