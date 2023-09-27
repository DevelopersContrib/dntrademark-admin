import axios from 'axios';

export const GET = async (req: Request) => {
  try {
    console.log('im here');
    console.log(req);
  } catch (error) {
    console.log(error);
  }
};
