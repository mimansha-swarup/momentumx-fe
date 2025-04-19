import { IS_NEW_USER } from "@/constants/root";

export const getIsNewUser = (): boolean =>
  JSON.parse(localStorage.getItem(IS_NEW_USER) || "false");
