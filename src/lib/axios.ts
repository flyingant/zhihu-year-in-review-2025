import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const defaultConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

const axiosInstance: AxiosInstance = axios.create(defaultConfig);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // @TODO: 401 跳转到我们活动的无须登录的入口页
    if (error.response?.status === 401) {
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
