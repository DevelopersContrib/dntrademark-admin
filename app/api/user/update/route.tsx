import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const token = data.token
    
    const headers = { 'Authorization': 'Bearer '+token }; // auth header with bearer token
    
    const apiUrl = process.env.API_URL + '/user/update?api_key=' + process.env.API_KEY;

    const params = new URLSearchParams();
    //params.append('is_onboarding', data.is_onboarding);
 
    const res = await axios.put(apiUrl, data, { headers });
    const result = res.data;

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
};
