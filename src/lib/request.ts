// libs/request.ts
import axiosInstance from "./axios";
import type { AxiosRequestConfig } from "axios";

// zhihu 后端通用的响应数据结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export interface RequestConfig extends AxiosRequestConfig {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: any;
  params?: any;
}

// 给调用 api.zhihu.com/api 使用
export default async function request<T = any>(
  requestConfig: RequestConfig
): Promise<T> {
  requestConfig.baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  requestConfig.withCredentials = true;
  const response = await axiosInstance(requestConfig);
  if (response.data.success) {
    return response.data.data;
  } else {
    return Promise.reject(response.data);
  }
}

// 给调用 www.zhihu.com/api/v4 使用
export async function authRequest<T = any>(
  requestConfig: RequestConfig
): Promise<T> {
  requestConfig.baseURL = process.env.NEXT_PUBLIC_BASE_LOGIN_API_URL;
  requestConfig.withCredentials = true;
  const response = await axiosInstance(requestConfig);
  return response.data;
}
