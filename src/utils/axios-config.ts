import axios from "axios";
import type { ApiError } from "@/types/api-error";
import { getToken, removeToken } from "@/utils/auth-storage";
import { BaseUrl } from "@/utils/url-helper";

export const AxiosClient = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Type": "application/json",
  },
  timeout: 15_000,
});

AxiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

AxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
    }
    const apiError: ApiError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ?? error.message ?? "Unexpected error",
      data: error.response?.data,
      isNetworkError: !error.response,
      errors: error.response?.data?.errors,
    };
    return Promise.reject(apiError);
  }
);

export default AxiosClient;
