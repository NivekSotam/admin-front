import axios from 'axios';

const baseConfig = {
  baseURL: "http://localhost:81/faculdade/admin/api/",
  timeout: 60 * 1000,
};

const axiosInstance = axios.create(baseConfig);

export default axiosInstance;