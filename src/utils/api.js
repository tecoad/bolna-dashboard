import axios from 'axios';

const createApiInstance = (token) => {
  return axios.create({
    baseURL: process.env.REACT_APP_FAST_API_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      // You can add other default headers here
    }
  });
};


export default createApiInstance;
