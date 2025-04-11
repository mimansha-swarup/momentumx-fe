import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase/config";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  currentUser,
  // setLoading,
  setUser,
  userLoading,
} from "@/utils/feature/user/user.slice";
import { getUser } from "@/utils/feature/user/user.thunk";

export const useAuthenticate = () => {
  const dispatch = useAppDispatch();
  // const user = useAppSelector(currentUser);

  useEffect(() => {
    // dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(getUser());
        // dispatch(setLoading(false));
      } else {
        dispatch(setUser(null));
        // dispatch(setLoading(false));
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
