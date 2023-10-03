import { User } from '@/types/user';
import axios from 'axios';

export const checkEmail = async (email?: string) => {
  try {
    const res = await fetch('/api/user/check?email=' + email, {
      method: 'get',
    });
    const result = await res.json();

    return !result.data.error.success && result.data.error === 'Email is available.' ? { isEmailAvailable: true } : { isEmailAvailable: false };
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
  console.log('authorizeUser');
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
          const userId = result.data.id;
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
