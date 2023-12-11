import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { NextResponse } from 'next/server';

export const GET =async (req: Request) => {
    try {
        const session = await getServerSession(options);
        const url = new URL(req.url);
        const search = url.searchParams.get("search");
        const limit = url.searchParams.get("limit");

        const apiUrl = process.env.API_URL + '/invoices/?api_key=' + process.env.API_KEY + "&search=" + search + "&limit=" + limit;

        const res = await axios.get(apiUrl, {
            headers: {
              Authorization: "Bearer " + session?.token,
              "Content-Type": "application/json",
            },
          });

        return NextResponse.json(res.data, { status: 200 });
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
