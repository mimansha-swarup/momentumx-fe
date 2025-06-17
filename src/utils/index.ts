import { IS_NEW_USER, LOGGED_IN } from "@/constants/root";

export const getIsNewUser = (): boolean =>
  JSON.parse(localStorage.getItem(IS_NEW_USER) || "false");

export const isUserLoggedIn= (): boolean => JSON.parse(localStorage.getItem(LOGGED_IN) || "false")