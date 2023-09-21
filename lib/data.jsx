import { headers } from "next/headers";
import axios from "axios";

export async function getPlans() {
   
    const url = process.env.GET_PLANS
    const res = await fetch(url);
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
  
    return res.json();
}