import { User } from '@/types/user';

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
