import axios from "axios";
import { getAuth } from "firebase/auth";
const getApiDomain = () => {
  const env = import.meta.env.VITE_ENV || "production";

  switch (env) {
    case "dev":
      return "https://metric-tracker.netlify.app";
    case "local":
    default: // in future add prod in default
      return "http://localhost:3000";
  }
};

// const user = auth.currentUser;
const apiDomain = getApiDomain();

const baseFetch = axios.create({
  baseURL: apiDomain,
});

baseFetch.interceptors.request.use(
  async (config) => {
    const user = getAuth().currentUser;
    const token = await user?.getIdToken();
    console.log("token: ", token, user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { baseFetch };
