import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: Request) => {
  const url = process.env.API_URL + '/packages?api_key=' + process.env.API_KEY
  
  try {
    // console.log(url);
    
    const res = await axios.get(url);
    const result = res.data;

    return NextResponse.json(result.data);
  } catch (error) {
    console.log('Error: ', error)
  }
}
