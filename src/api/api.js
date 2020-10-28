import { getCustomerInfo, refreshToken } from './login';

const axios = require('axios');

/**
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 1200,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const {
      config: originalRequest,
      response: { status },
    } = error;

    if (status === 401) {
      const { id } = await getCustomerInfo();

      const data = await refreshToken(id);

      return new Promise((resolve) => {
        originalRequest.headers['x-access-token'] = data.accessToken;
        resolve(axios(originalRequest));
      });
    } else {
      return Promise.reject(error);
    }
  },
);

export default api;
