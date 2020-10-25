const axios = require('axios');

/**
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 5000,
});

export default api;
