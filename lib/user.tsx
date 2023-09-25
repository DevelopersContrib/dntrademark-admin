import axios from 'axios';

export async function getUser(token: String): Promise<any> {
  try {
    const res = await axios('http://127.0.0.1:8000/api/auth/user', {
      headers: {
        Authorization: 'Bearer ' + atob(token),
      },
    });

    return res;
  } catch (error) {
    return error;
  }
}
