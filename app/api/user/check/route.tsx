import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    const apiUrl = process.env.API_URL + '/user/check?api_key=' + process.env.API_KEY + '&email=' + email;

    const res = await axios.get(apiUrl);

    return NextResponse.json(res.data);
  } catch (error) {
    console.log('Error', error);
  }
};
