import axios from 'axios';

export const getDomains = async (search:string,limit:number,page:number) => {
  try {
    const res = await fetch('/api/domain/list', {
      method: 'POST',
      body: JSON.stringify({ search: search, limit: limit, page:page })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};
