import axios from 'axios';
import { FaDumpster } from 'react-icons/fa6';

const headers = {
  'Content-Type': 'application/json', // set the Content-Type header
};

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const apiUrl = process.env.API_URL + '/user/check/credentials?api_key=' + process.env.API_KEY;

    const params = new URLSearchParams();
    params.append('email', data.email);
    params.append('password', data.password);

    const res = await axios.post(apiUrl, params);
    const result = res.data;

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return error;
  }
};
