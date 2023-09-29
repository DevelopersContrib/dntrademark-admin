import { User } from '@/types/user';
import axios from 'axios'

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

// export const saveUser = async (values: User) => {
//   try {
//     const res = await fetch('/api/auth/signup', {
//       method: 'POST',
//       body: JSON.stringify(values),
//     });

//     const result = await res.json();

//     if (result.data.id) {
//       return { id: result.data.id, name: values.firstName };
//     }
//   } catch (error) {
//     console.log('Error', error);
//   }
// };
export async function saveUser(credentials: { firstName: string; lastName: string; email: string; password: string; }) {
  // console.log('credentials..',credentials)
  const urlCheck = process.env.API_URL+'/user/check?api_key='+process.env.API_KEY+'&email='+credentials.email
  
  const checkRes = await axios.get(urlCheck);
  if(/*!checkRes.data.data.success &&*/ checkRes.data.data.data.length==0){
      console.log('not found')
      const params = new URLSearchParams();
      params.append('first_name', credentials.firstName);
      params.append('last_name', credentials.lastName);
      params.append('email', credentials.email);
      params.append('password', credentials.password);
      
      const urlSave = process.env.API_URL+'/user/save?api_key='+process.env.API_KEY
      const saveRes = await axios.post(urlSave, params);
      
      if(saveRes.data.data.success){
          const signinUrl = process.env.API_URL+'/auth/login?api_key='+process.env.API_KEY
          const signinRes = await axios.post(signinUrl,params);
          
          return ({success:true, id:saveRes.data.data.data.id, name:credentials.firstName, email:credentials.email, token:signinRes.data.token});
      }else{
          return null
      }
  }else{
      const d = checkRes.data.data.data;
      
      const params = new URLSearchParams();

      params.append('email', credentials.email);
      params.append('password', credentials.password);

      const signinUrl = process.env.API_URL+'/auth/login?api_key='+process.env.API_KEY
      const signinRes = await axios.post(signinUrl,params);
      return { id: d.id, email:credentials.email, name: d.first_name, token:signinRes.data.token }
  }
}
