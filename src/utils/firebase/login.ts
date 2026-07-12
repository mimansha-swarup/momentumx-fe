import {
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider } from "./config";
import { LOGGED_IN } from "@/constants/root";
import { NavigateFunction } from "react-router-dom";

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const persistLogin = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    // Persistence error — fall through to sign-in attempt; Firebase will fall back to session storage.
  }
  return googleLogin();
};

export const googleLogOut = (navigate: NavigateFunction) => {
  signOut(auth);
  localStorage.removeItem(LOGGED_IN);
  navigate("/login");
};
