import {
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider } from "./config";

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
    const user = result.user;
    // Set the cookie with user information for 1 hour (3600 seconds)
    // document.cookie = `user=${JSON.stringify(user)}; path=/;`;
    return user;
  } catch (error) {
    console.error("Error logging in with Google: ", error);
    throw error;
  }
};

export const googleLogOut = () => {
  signOut(auth);
};
