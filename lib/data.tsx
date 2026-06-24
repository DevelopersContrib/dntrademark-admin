import { User } from "@/types/user";
import axios, { AxiosError } from "axios";
import { options } from "@/lib/options";
import { getServerSession } from "next-auth/next";
import {
  getSessionUserId,
  listDomains,
  listDomainsWithHits,
  listDomainsWithoutHits,
  listDomainItems,
  getDomainStats as dbDomainStats,
  getHistoricalHits,
  listInvoices,
  getUserById,
  getUserPlan as dbUserPlan,
  getDomainReport as dbDomainReport,
} from "@/lib/db-queries";
interface Error {
  message: string[];
  statusCode: number;
}

export const getGraph = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return undefined;
    return await getHistoricalHits(userId);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getDomainList = async (
  limit: number = 10,
  page: number = 1,
  sortBy: string = "domain_name",
  orderBy: string = "ASC",
  filter: string = ""
) => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return null;
    return await listDomains(userId, { limit, page, sortBy, orderBy, filter });
  } catch (err) {
    console.log("Error", err);
    return null;
  }
};

export const getItemProtestList = async (
  item_id:number,
  limit: number = 10,
  page: number = 1,
  sortBy: string = "id",
  orderBy: string = "ASC",
  filter: string = ""
) => {
  try {
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };

    const apiUrl =
      process.env.API_URL +
      "/items/protests/"+item_id+"?api_key=" +
      process.env.API_KEY +
      "&filter=" +
      filter +
      "&limit=" +
      limit +
      "&page=" +
      page +
      "&sortBy=" +
      sortBy +
      "&orderBy=" +
      orderBy;
    const res = await axios.get(apiUrl, config);

    return res.data.item_protests;
  } catch (err) {
    const error = err as AxiosError<Error>;

    return error.response?.data.message;
  }
};

export const getDomainListWithHits = async (
  limit: number = 10,
  page: number = 1,
  sortBy: string = "domain_name",
  orderBy: string = "ASC",
  filter: string = ""
) => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return null;
    return await listDomainsWithHits(userId, { limit, page, sortBy, orderBy, filter });
  } catch (err) {
    console.log("Error", err);
    return null;
  }
};

export const getDomainListWithOutHits = async (
  limit: number = 10,
  page: number = 1,
  sortBy: string = "domain_name",
  orderBy: string = "ASC",
  filter: string = ""
) => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return null;
    return await listDomainsWithoutHits(userId, { limit, page, sortBy, orderBy, filter });
  } catch (err) {
    console.log("Error", err);
    return null;
  }
};

export const getDomainItems = async (
  id: number,
  limit: number = 10,
  page: number = 1,
  sortBy: string = "",
  orderBy: string = "ASC",
  filter: string = ""
) => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return null;
    return await listDomainItems(userId, id, { limit, page, sortBy, orderBy, filter });
  } catch (err) {
    console.log("Error", err);
    return null;
  }
};

export const getDomainReport = async (id: number) => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return null;
    return await dbDomainReport(userId, id);
  } catch (err) {
    console.log("Error", err);
    return null;
  }
};

export const getNotification = async (token: any, id: any) => {
  //const session = await getServerSession(options);
  const session = token;

  const config = {
    headers: { Authorization: "Bearer " + session },
  };

  const url =
    "https://api.dntrademark.com/api/v1/notifications/" +
    id +
    "?api_key=6334aed4bdce9855f400653800596920";

  //const url ='https://api.dntrademark.com/api/v1/packages?api_key=6334aed4bdce9855f400653800596920';
  const res = await axios.get(url, config);

  return res.data.message;
};


export const getItem = async (id: number) => {
  try {
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };

    const apiUrl =
      process.env.API_URL + "/items/" + id + "?api_key=" + process.env.API_KEY;
    const res = await axios.get(apiUrl, config);

    return res.data.item;
  } catch (err) {
    const error = err as AxiosError<Error>;

    return error.response?.data.message;
  }
};

export const getItemProtests = async (id: number) => {
  try {
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };

    const apiUrl =
      process.env.API_URL + "/items/protests/" + id + "?api_key=" + process.env.API_KEY;
    const res = await axios.get(apiUrl, config);
    return res.data.item_protests;
  } catch (err) {
    const error = err as AxiosError<Error>;

    return error.response?.data.message;
  }
};

export const getInvoiceDetails = async (id: number) => {
  try {
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };

    const apiUrl =
      process.env.API_URL + "/invoices/" + id + "?api_key=" + process.env.API_KEY;
    const res = await axios.get(apiUrl, config);
    //console.log(res);
    return res.data.invoice;
  } catch (error) {
    console.log("Error", error);
  }
};

export const getPackage = async (id: number) => {
  try {
    const url =
      process.env.API_URL + "/packages?api_key=" + process.env.API_KEY;
    const res = await axios.get(url);
    const data = res.data.data.data.find(
      (item: { id: number }) => item.id === id
    );
    return data;
  } catch (error) {
    return null;
  }
};

export const getDomainStats = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return undefined;
    return await dbDomainStats(userId);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getFeed = async () => {
  try {
    // Cache for an hour and bail after 3s so a slow blog never stalls the dashboard.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch("https://blog.dntrademark.com/feed", {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);
    const text = await response.text();

    return text;
  } catch (error) {
    console.log("Error", error);
    return "";
  }
};

export const getUser = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return undefined;
    return await getUserById(userId);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getUserPackage = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return undefined;
    return await getUserById(userId);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getUserPlan = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return undefined;
    return await dbUserPlan(userId);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getPackages = async () => {
  try {
    const url =
      process.env.API_URL + "/packages?api_key=" + process.env.API_KEY;
    const res = await axios.get(url);
    const result = res.data;
    return result.data;
  } catch (error) {
    console.log("Error", error);
  }
};

export const getInvoice = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) return undefined;
    return await listInvoices(userId, {});
  } catch (error) {
    console.log("Error", error);
  }
};