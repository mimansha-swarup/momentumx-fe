import { IS_NEW_USER, LOGGED_IN } from "@/constants/root";

const parseBool = (key: string): boolean => {
  try {
    return JSON.parse(localStorage.getItem(key) || "false");
  } catch {
    return false;
  }
};

export const getIsNewUser = (): boolean => parseBool(IS_NEW_USER);

export const isUserLoggedIn = (): boolean => parseBool(LOGGED_IN);
