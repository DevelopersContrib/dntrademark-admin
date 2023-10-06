import axios from 'axios';

const headers = {
  'Content-Type': 'application/json', // set the Content-Type header
};

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const apiUrl = process.env.API_URL + '/user/check/credentials?api_key=' + process.env.API_KEY;
    // const apiUrl = 'http://127.0.0.1:8000/api/v1/user/check/credentials?api_key=' + process.env.API_KEY;

    const params = new URLSearchParams();
    params.append('email', data.email);
    params.append('password', data.password);

    const res = await axios.post(apiUrl, params);
    const result = res.data;

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.log(error);
    return error;
  }
};
