const axios = require('axios');

/**
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: 'http://192.168.68.102:3000/api',
});

export default api;
