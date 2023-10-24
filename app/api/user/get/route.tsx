import { NextResponse } from 'next/server';
import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from "next-auth/next"

export const GET = async (req: Request) => {
  /*
  try {

    const session = await getServerSession(options)

    const config = {
      headers: { 'Authorization': 'Bearer ' + session?.token }
    };
    
    
     const apiUrl = process.env.API_URL + '/user/'+session?.id+'?api_key=' + process.env.API_KEY;
     console.log(apiUrl)

     axios.get(apiUrl, config)
  .then(response => {
    console.log(response.data);
    const result = response.data.user;
    return NextResponse.json(result);
  })
  .catch(error => {
    console.error(error);
  });
    
    // const res = await axios.get(apiUrl, config)
    // if (!res.ok) throw new Error('failed to fetch data')

    //console.log(res.json()) // KO
     //const result = res.data.data;
    
    
  } catch (error) {
    console.log(error);
  }

  */
  return NextResponse.json({result:null});
};