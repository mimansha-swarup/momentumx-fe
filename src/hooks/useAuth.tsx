import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase/config";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  currentUser,
  setLoading,
  setUser,
  userLoading,
} from "@/utils/feature/user/user.slice";
import { getUser } from "@/utils/feature/user/user.thunk";
import { getIsNewUser } from "@/utils";
import { LOGGED_IN } from "@/constants/root";

export const useAuthenticate = () => {
  const dispatch = useAppDispatch();
  // const user = useAppSelector(currentUser);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        localStorage.setItem(LOGGED_IN, "true");
        if (getIsNewUser()) {
          dispatch(setUser(firebaseUser));
          dispatch(setLoading(false));
        } else dispatch(getUser());
      } else {
        dispatch(setUser(null));
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, []);
};

export const useAuthCredential = () => {
  const user = useAppSelector(currentUser);
  const loading = useAppSelector(userLoading);
  return { user, loading };
};
