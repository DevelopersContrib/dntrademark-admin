import axios from "axios";

import { options } from '@/lib/options';
import { getServerSession } from 'next-auth/next';

export const GET = async (req: Request, { params }) => {
    try {
        console.log(params);
        console.log(typeof(params));
    } catch (error) {
        console.log(error);
        throw error;
    }
}