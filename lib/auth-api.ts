import axios from 'axios';
import { User } from '@/types/user';

export const checkEmail = async (email: string) => {
  try {
    const apiUrl =
      process.env.API_URL +
      '/user/check?api_key=' +
      process.env.API_KEY +
      '&email=' +
      email;

    const result = await axios.get(apiUrl, { timeout: 4000 });
    return result.data.data.data.id
      ? { isEmailAvailable: false }
      : { isEmailAvailable: true };
  } catch (error) {
    console.log('Error', error);
  }
};

export const loginUser = async () => {
  try {
    await fetch('/api/auth/signin', {
      method: 'POST',
    });
  } catch (error) {
    console.log('Error', error);
  }
};

export const saveUser = async (values: User) => {
  try {
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
    const apiUrl =
      process.env.API_URL +
      '/user/check?api_key=' +
      process.env.API_KEY +
      '&email=' +
      credentials.email;

    const res = await axios.get(apiUrl, { timeout: 4000 });
    const result = res.data;

    if (result.data.success && result.data.error === '') {
      try {
        const loginUrl =
          process.env.API_URL + '/auth/login?api_key=' + process.env.API_KEY;
        const params = new URLSearchParams();

        params.append('email', credentials.email as string);
        params.append('password', credentials.password as string);

        const loginRes = await axios.post(loginUrl, params);

        if (loginRes.data.token) {
          return {
            id: result.data.data.id,
            email: credentials.email,
            name: result.data.data.first_name,
            token: loginRes.data.token,
          };
        }
      } catch (error) {
        console.log('error', error);
      }
    } else {
      try {
        const saveUrl =
          process.env.API_URL + '/user/save?api_key=' + process.env.API_KEY;
        const params = new URLSearchParams();
        params.append('first_name', credentials.firstName as string);
        params.append('last_name', credentials.lastName as string);
        params.append('email', credentials.email as string);
        params.append('password', credentials.password as string);

        const saveRes = await axios.post(saveUrl, params);
        const saveResult = saveRes.data;

        if (saveResult.success) {
          return {
            id: saveResult.user.id,
            email: saveResult.user.email,
            name: saveResult.user.first_name,
            token: saveResult.token,
          };
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  } catch (error) {
    console.log('error', error);
  }
};
