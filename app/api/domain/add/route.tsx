import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const token = data.token
    
    const headers = { 'Authorization': 'Bearer '+token }; // auth header with bearer token
    
    const apiUrl = process.env.API_URL + '/domains/add?api_key=' + process.env.API_KEY;

    // const params = new URLSearchParams(); 
    // params.append('domains', data.domains);
    // params.append('add_domain', data.add_domain);
    
    const params = {
      domains: data.domains,
      add_domain: data.add_domain
    }
 
    const res = await axios.post(apiUrl, params, { headers });
    const result = res.data;

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
};