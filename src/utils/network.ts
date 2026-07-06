import axios from "axios";
import { getAuth } from "firebase/auth";
export const getApiDomain = (isLongResponse = false) => {
  const env = import.meta.env.VITE_ENV || "production";
  if (env === "local") return "http://localhost:3000";
  if (isLongResponse) return "https://momentumx-be.onrender.com";
  switch (env) {
    // return "https://momentumx-be.vercel.app";
    case "dev":
    default: // in future add prod in default
      return "https://momentumx-be.onrender.com";
  }
};

export interface IBaseFetchResponse<T> {
  message?: string;
  warning?: string;
  statusCode?: number;
  meta?: Record<string, unknown>;
  data?: T;
}

const apiDomain = getApiDomain();

const baseFetch = axios.create({
  baseURL: apiDomain,
});

baseFetch.interceptors.request.use(
  async (config) => {
    const user = getAuth().currentUser;
    const token = await user?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { baseFetch };
