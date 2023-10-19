import { User } from '@/types/user';
import axios from 'axios';
import { options } from '@/lib/options';
import { getServerSession } from "next-auth/next"
import { FaDumpster } from 'react-icons/fa6';

export const checkEmail = async (email?: string) => {
  try {
    const urlCheck = process.env.API_URL + '/user/check?api_key=' + process.env.API_KEY + '&email=' + email;

    console.log('urlCheck', process.env.API_URL);
    console.log('urlCheck', urlCheck);

    const result = await axios.get(urlCheck);
    return !result.data.error.success && result.data.error === 'Email is available.' ? { isEmailAvailable: true } : { isEmailAvailable: false };
    // return { isEmailAvailable: false }
  } catch (error) {
    console.log('Error', error);
  }
};

export const getPackage = async (id: number) => {
  try {
    const url = process.env.API_URL + '/packages?api_key=' + process.env.API_KEY;
    const res = await axios.get(url);
    const data = res.data.data.data.find((item: { id: number }) => item.id === id);
    return data;
  } catch (error) {
    console.log('Error', error);
    return null;
  }
};

export const getDomainStats = async () => {
  try {
    const session = await getServerSession(options)
    console.log('session',session)
    const config = {
      headers:{ 'Authorization': 'Bearer '+session?.token }
    };
    const apiUrl = process.env.API_URL + '/domains/stats?api_key=' + process.env.API_KEY;
    const res = await axios.get(apiUrl, config)
    
    // const res = await axios.get(apiUrl)
    return res.data.data;
  } catch (error) {
    console.log('Error', error);
  }
};

export const getUserPackage = async () => {
  try {
    const session = await getServerSession(options)
    console.log('session::',session)
    const config = {
      headers:{ 'Authorization': 'Bearer '+session?.token }
    };
    const apiUrl = process.env.API_URL + '/user/'+session?.id+'?api_key=' + process.env.API_KEY;
    const res = await axios.get(apiUrl, config)
    //console.log(res);
    // const res = await axios.get(apiUrl)
    return res.data.user;
  } catch (error) {
    console.log('Error', error);
  }
};

export const getPackages = async () => {
  try {
    const url = process.env.API_URL + '/packages?api_key=' + process.env.API_KEY;
    const res = await axios.get(url);
    const result = res.data;
    return result.data;
  } catch (error) {
    console.log('Error', error);
  }
};

export const loginUser = async (data: User) => {
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
    });
  } catch (error) {
    console.log('Error', error);
  }
};

export const saveUser = async (values: User) => {
  try {
    // ayaw na ug call diri /api/auth/signup kai serverside naman ni...diritso na sa api call didto sa process.env.API_URL
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const result = await res.json();

    if (result.data.id) {
      return { id: result.data.id, name: values.firstName };
    }
  } catch (error) {
    console.log('Error', error);
  }
};

export const authorizeUser = async (credentials: User) => {
  try {
    const apiUrl = process.env.API_URL + '/user/check?api_key=' + process.env.API_KEY + '&email=' + credentials.email;

    const res = await axios.get(apiUrl);
    const result = res.data;

    if (result.data.success && result.data.error === '') {
      try {
        const apiUrl = process.env.API_URL + '/auth/login?api_key=' + process.env.API_KEY;
        const params = new URLSearchParams();

        params.append('email', credentials.email as string);
        params.append('password', credentials.password as string);

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
        console.log('error', error);
      }

      // return user;
    } else {
      try {
        const apiUrl = process.env.API_URL + '/user/save?api_key=' + process.env.API_KEY;
        const params = new URLSearchParams();
        params.append('first_name', credentials.firstName as string);
        params.append('last_name', credentials.lastName as string);
        params.append('email', credentials.email as string);
        params.append('password', credentials.password as string);

        const res = await axios.post(apiUrl, params);
        const result = res.data;

        if (result.success) {
          const userId = result.data.data.id;
          const apiUrl = process.env.API_URL + '/auth/login?api_key=' + process.env.API_KEY;
          const params = new URLSearchParams();

          params.append('email', credentials.email as string);
          params.append('password', credentials.password as string);

          const res = await axios.post(apiUrl, params);

          if (res.data.token) {
            return {
              id: userId,
              email: credentials.email,
              name: credentials.firstName,
              token: res.data.token,
            };
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  } catch (error) {}
};
