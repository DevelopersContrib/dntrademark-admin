import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const POST = async (req: Request) => {
//   try {
//     const data = await req.json();
//     // return new Response(JSON.stringify({ domains: data.domains }), { status: 200 });
//     const session = await getServerSession(options);
//     const config = {
//       headers: { Authorization: 'Bearer ' + session?.token },
//     };

//     const apiUrl = process.env.API_URL + '/domains?api_key=' + process.env.API_KEY + '&filter='+data.search+'&limit='+data.limit+'&page='+data.page;
//     const res = await axios.get(apiUrl, config);

//     return new Response(JSON.stringify({ domains: res.data.domains }), { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
    try {
        const data = await req.json();
          const session = await getServerSession(options);
          const config = {
            headers: { Authorization: 'Bearer ' + session?.token },
            data:{domains:data.domains},
          };
      
          const apiUrl = process.env.API_URL + '/domains/delete?api_key=' + process.env.API_KEY;
          const res = await axios.delete(apiUrl, config);
          console.log('res.data',res.data)
          return new Response(JSON.stringify({ domains: res.data }), { status: 200 });
        } catch (error) {
          console.log(error);
          return error;
        }
};


// export const GET = async (req: Request) => {
//     try {
//       const session = await getServerSession(options);
//       const config = {
//         headers: { Authorization: 'Bearer ' + session?.token },
//         data:{domains:[28,27]},
//       };
  
//       const apiUrl = process.env.API_URL + '/domains/delete?api_key=' + process.env.API_KEY;
//       const res = await axios.delete(apiUrl, config);
//       console.log('res.data',res.data)
//       return new Response(JSON.stringify({ domains: res.data }), { status: 200 });
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
//   };
  