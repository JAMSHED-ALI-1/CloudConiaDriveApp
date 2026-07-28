import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import { baseURL } from './constant/settings';

export const getCsrfToken = async () => {
  // Call sanctum csrf cookie
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });

  // Read cookies
  const cookies = await CookieManager.get(baseURL);

  // Return XSRF token
  return cookies['XSRF-TOKEN']?.value;
};
