import { User } from "@/types/user";
import axios, { AxiosError } from "axios";
import { options } from "@/lib/options";
import { getServerSession } from "next-auth/next";
interface Error {
  message: string[];
  statusCode: number;
}

export const getGraph = async () => {
  try {
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token, timeout: 10000 },
    };
    const apiUrl =
      process.env.API_URL +
      "/domains/historical-hits?api_key=" +
      process.env.API_KEY;
    const res = await axios.get(apiUrl, config);

    return res.data.data;
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
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };

    const apiUrl =
      process.env.API_URL +
      "/domains?api_key=" +
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

    return res.data.domains;
  } catch (err) {
    const error = err as AxiosError<Error>;

    return error.response?.data.message;
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
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };

    const apiUrl =
      process.env.API_URL +
      "/domains/hits?api_key=" +
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
    console.log(res.data.domains);

    return res.data.domains;
  } catch (err) {
    const error = err as AxiosError<Error>;

    return error.response?.data.message;
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
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };

    const apiUrl =
      process.env.API_URL +
      "/domains/no-hits?api_key=" +
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

    return res.data.domains;
  } catch (err) {
    const error = err as AxiosError<Error>;

    return error.response?.data.message;
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
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
      timeout: 10000,
    };
  
    const apiUrl =
      process.env.API_URL +
      "/domains/items/" +
      id +
      "?api_key=" +
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
      console.log('apiUrl',apiUrl)
    const res = await axios.get(apiUrl, config);

    return res.data.items;
  } catch (err) {
    const error = err as AxiosError<Error>;

    return error.response?.data.message;
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
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token },
    };
    const apiUrl =
      process.env.API_URL + "/domains/stats?api_key=" + process.env.API_KEY;
    const res = await axios.get(apiUrl, config);

    // console.log('res.data.data',res.data.data);
    return res.data.data;
  } catch (error) {
    console.log("Error", error);
  }
};

export const getFeed = async () => {
  try {
    const response = await fetch("https://blog.dntrademark.com/feed");
    const text = await response.text();

    return text;
  } catch (error) {
    console.log("Error", error);
  }
};

export const getUser = async () => {
  try {
    const session = await getServerSession(options);

    const config = {
      headers: { Authorization: "Bearer " + session?.token },
    };
    const apiUrl =
      process.env.API_URL +
      "/user/" +
      session?.id +
      "?api_key=" +
      process.env.API_KEY;
    const res = await axios.get(apiUrl, config);

    return res.data.user;
  } catch (error) {
    console.log("Error", error);
  }
};

export const getUserPackage = async () => {
  try {
    const session = await getServerSession(options);

    const config = {
      headers: { Authorization: "Bearer " + session?.token },
    };
    const apiUrl =
      process.env.API_URL +
      "/user/" +
      session?.id +
      "?api_key=" +
      process.env.API_KEY;
    const res = await axios.get(apiUrl, config);

    return res.data.user;
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
    const session = await getServerSession(options);
    const config = {
      headers: { Authorization: "Bearer " + session?.token, timeout: 10000 },
    };

    const apiUrl = process.env.API_URL +"/invoices?api_key=" + process.env.API_KEY;
    const res = await axios.get(apiUrl, config);
    return res.data.invoices;
  } catch (error) {
    console.log("Error", error);
  }
};