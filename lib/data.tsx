import { User } from "@/types/user";
import axios, { AxiosError } from "axios";
import { options } from "@/lib/options";
import { getServerSession } from "next-auth/next";
import { FaDumpster } from "react-icons/fa6";
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

export const checkEmail = async (email: string) => {
  try {
    const urlCheck =
      "https://api.dntrademark.com/api/v1/user/check?api_key=6334aed4bdce9855f400653800596920&email=" +
      email;

    const result = await axios.get(urlCheck, { timeout: 4000 });
    //console.log(result.data.data.data.id)
    return result.data.data.data.id
      ? { isEmailAvailable: false }
      : { isEmailAvailable: true };
    // return { isEmailAvailable: false }
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
  } catch (error) {
    console.log("Error", error);
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
  } catch (error) {
    console.log("Error", error);
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
  } catch (error) {
    console.log("Error", error);
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

export const getNotificationsNew = async () => {
  try {
    const res = await fetch("/api/notifications/", {
      method: "GET"
    });

    const result = await res.json();

    return result;
  } catch (error) {
    console.log("Error", error);
  }
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
  } catch (error) {
    console.log("Error", error);
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
  } catch (error) {
    console.log("Error", error);
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

export const loginUser = async (data: User) => {
  try {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
    });
  } catch (error) {
    console.log("Error", error);
  }
};

export const saveUser = async (values: User) => {
  try {
    // ayaw na ug call diri /api/auth/signup kai serverside naman ni...diritso na sa api call didto sa process.env.API_URL
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const result = await res.json();

    if (result.data.id) {
      return { id: result.data.id, name: values.firstName };
    }
  } catch (error) {
    console.log("Error", error);
  }
};

export const authorizeUser = async (credentials: User) => {
  try {
    const apiUrl =
      process.env.API_URL +
      "/user/check?api_key=" +
      process.env.API_KEY +
      "&email=" +
      credentials.email;

    const res = await axios.get(apiUrl, { timeout: 4000 });
    const result = res.data;

    if (result.data.success && result.data.error === "") {
      try {
        const apiUrl =
          process.env.API_URL + "/auth/login?api_key=" + process.env.API_KEY;
        const params = new URLSearchParams();

        params.append("email", credentials.email as string);
        params.append("password", credentials.password as string);

        const res = await axios.post(apiUrl, params);

        if (res.data.token) {
          return {
            id: result.data.data.id,
            email: credentials.email,
            name: result.data.data.first_name,
            token: res.data.token,
          };
        }
      } catch (error) {
        console.log("error", error);
      }

      // return user;
    } else {
      console.log("not found");
      try {
        const apiUrl =
          process.env.API_URL + "/user/save?api_key=" + process.env.API_KEY;
        const params = new URLSearchParams();
        params.append("first_name", credentials.firstName as string);
        params.append("last_name", credentials.lastName as string);
        params.append("email", credentials.email as string);
        params.append("password", credentials.password as string);

        const res = await axios.post(apiUrl, params);
        const result = res.data;

        if (result.success) {
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.first_name,
            token: result.token,
          };
          // const userId = result.data.user.id;
          // const apiUrl = process.env.API_URL + '/auth/login?api_key=' + process.env.API_KEY;
          // const params = new URLSearchParams();

          // params.append('email', credentials.email as string);
          // params.append('password', credentials.password as string);

          // const res = await axios.post(apiUrl, params);

          // if (res.data.token) {
          //   return {
          //     id: userId,
          //     email: credentials.email,
          //     name: credentials.firstName,
          //     token: res.data.token,
          //   };
          // }
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  } catch (error) {
    console.log("error", error);
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