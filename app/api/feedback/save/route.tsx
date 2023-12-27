import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const apiUrl = "https://manage.vnoc.com/v2/dntrademarks/addfeedback";
    const params = new URLSearchParams();
    params.append('feedback_email', data.email);
    params.append('feedback_name', data.name);
    params.append('feedback_message', data.message);

    const res = await axios.post(apiUrl, params);
    const result = res.data;

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return error;
  }
};
