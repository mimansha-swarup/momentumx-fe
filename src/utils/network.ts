import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { LOGGED_IN } from "@/constants/root";
export const getApiDomain = (isLongResponse = false) => {
  const env = import.meta.env.VITE_ENV || "production";
  if (env === "local") return "http://localhost:3000";
  if (isLongResponse) return "https://momentumx-be.onrender.com";
  switch (env) {
    case "dev":
    default: // in future add prod in default
      return "https://momentumx-be.vercel.app";
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
  // Generous ceiling over the slowest legit call (idea generation with research
  // signals). Without it any backend stall spins a loading state forever.
  timeout: 150_000,
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

// Auth-failure handling (backend P0A): the API now returns 401 exclusively for
// authentication failures (invalid/expired session Firebase couldn't refresh),
// while 403 is reserved for ownership failures — which must NOT log the user
// out. On a 401 we sign out; onAuthStateChanged then clears the user and
// ProtectedRoute redirects to /login. The error is still rejected so callers'
// own error handling runs unchanged.
baseFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(LOGGED_IN);
      // Fire-and-forget so a signOut hiccup can neither delay nor mask the
      // caller's original error, which we always re-reject below.
      void signOut(getAuth()).catch(() => {});
    }
    return Promise.reject(error);
  }
);

export { baseFetch };
