import axios from "axios";

import { options } from "@/lib/options";
import { getServerSession } from "next-auth/next";

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(options);
    const url =
      process.env.API_URL + "/notifications?api_key=" + process.env.API_KEY;

    const res = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + session?.token,
        "Content-Type": "application/json",
      },
    });

    const result = res.data;

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
