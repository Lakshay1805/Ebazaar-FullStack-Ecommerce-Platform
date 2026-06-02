import axios from 'axios'
import {BASE_URL} from './constant.js' 

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout:10000,
    withCredentials:true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${BASE_URL}/user/refresh`, {}, { withCredentials: true });
        if (res.status === 200) {
          localStorage.setItem("token", res.data.accessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;