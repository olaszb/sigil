import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: axios.defaults.baseURL,
  withCredentials: axios.defaults.withCredentials,
  withXSRFToken: axios.defaults.withXSRFToken,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default axiosClient;