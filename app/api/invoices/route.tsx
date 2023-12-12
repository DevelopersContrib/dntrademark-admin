import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { NextResponse } from 'next/server';

export const POST =async (req: Request) => {
    try {
        const session = await getServerSession(options);
        const data = await req.json();

        const config =  { 
            headers: {
            Authorization: "Bearer " + session?.token,
            "Content-Type": "application/json",
        }}

        console.log("data", data);

        const url = process.env.API_URL + '/invoices?api_key=' + process.env.API_KEY + "&search=" + data.search + "&limit=" + data.limit;
        console.log('url',url)
        const res = await axios.get(url, config);

        return NextResponse.json(res.data, { status: 200 });
        // return NextResponse.json({test:1}, { status: 200 });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as any;

            console.log('Error Response Data:', axiosError.response?.data);

            return axiosError.response?.data;
        } else {
            return error;
        }
    }
}
