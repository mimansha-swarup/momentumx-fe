import axios, { CreateAxiosDefaults } from "axios";
import { auth } from "./firebase/config";
const getApiDomain = () => {
  const env = process.env.VITE_ENV || "production";

  switch (env) {
    case "dev":
      return "https://metric-tracker.netlify.app";
    case "local":
    default: // in future add prod in default
      return "http://localhost:3000";
  }
};

const user = auth.currentUser;

export const baseFetch = async (options: CreateAxiosDefaults = {}) => {
  const apiDomain = getApiDomain();
  const token = user?.getIdToken() || null;
  return axios.create({
    baseURL: apiDomain,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    ...options,
  });
};
