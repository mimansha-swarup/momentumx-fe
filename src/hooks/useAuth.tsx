import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase/config";
import { useAppDispatch } from "./useRedux";
import { setUser } from "@/utils/feature/user/user.slice";
import { getUser } from "@/utils/feature/user/user.thunk";
import { getIsNewUser } from "@/utils";
import { LOGGED_IN } from "@/constants/root";
import { IUserProfile } from "@/types/feature/user";

export const useAuthenticate = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        localStorage.setItem(LOGGED_IN, "true");
        if (getIsNewUser()) {
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? "",
              name: firebaseUser.displayName ?? "",
              photoURL: firebaseUser.photoURL ?? "",
              isOnboardingCompleted: false,
            } as IUserProfile),
          );
        } else dispatch(getUser());
      } else {
        localStorage.removeItem(LOGGED_IN);
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};
