import axios from 'axios';

export const getDomains = async () => {
  try {
    const res = await fetch('/api/domain/list', {
      method: 'GET',
    });

    console.log(res);
  } catch (error) {
    return error;
  }
};
