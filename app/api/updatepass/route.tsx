import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const token = data?.token
    console.log(data);
    const headers = { 'Authorization': 'Bearer '+token }; // auth header with bearer token
    console.log('Headers:', headers);
    const apiUrl = process.env.API_URL + '/account/reset-password?api_key=' + process.env.API_KEY;
    console.log(apiUrl);
    //const params = new URLSearchParams();
    //params.append('is_onboarding', data.is_onboarding);
 
    const res = await axios.put(apiUrl, data, { headers });
    const result = res.data;
    console.log('Response Data:', res.data);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
};
