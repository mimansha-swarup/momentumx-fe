import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase/config";
import { useAppDispatch } from "./useRedux";
import { setUser } from "@/utils/feature/user/user.slice";
import { getUser } from "@/utils/feature/user/user.thunk";
import { LOGGED_IN } from "@/constants/root";

export const useAuthenticate = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        localStorage.setItem(LOGGED_IN, "true");
        // Always load the real profile — the onboarding gate depends on its
        // fields, so a minimal client-built user would trap onboarded users.
        dispatch(getUser());
      } else {
        localStorage.removeItem(LOGGED_IN);
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};
