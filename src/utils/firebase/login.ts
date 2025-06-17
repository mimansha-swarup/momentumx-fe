import {
  browserLocalPersistence,
  getAdditionalUserInfo,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider } from "./config";
import { IS_NEW_USER, LOGGED_IN } from "@/constants/root";

export const persistLogin = async () => {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      googleLogin();
    })
    .catch((error) => {
      console.error("Error setting persistence: ", error);
    });
};
export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userInfo = getAdditionalUserInfo(result);
    const user = result.user;
    if (userInfo?.isNewUser) {
      localStorage.setItem(IS_NEW_USER, "true");
    }
    return user;
  } catch (error) {
    console.error("Error logging in with Google: ", error);
    throw error;
  }
};

export const googleLogOut = () => {
  signOut(auth);
  localStorage.removeItem(LOGGED_IN);
};
