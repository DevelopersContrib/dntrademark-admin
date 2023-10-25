import axios from 'axios';

export const getDomains = async () => {
  try {
    const res = await fetch('/api/domain/list', {
      method: 'GET',
    });
    return res.json();
  } catch (error) {
    return error;
  }
};
