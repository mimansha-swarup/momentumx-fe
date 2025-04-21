import { configureStore, Middleware } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import userReducer from "../feature/user/user.slice";
import titlesReducer from "../feature/titles/titles.slice";
import scriptsReducer from "../feature/scripts/script.slice";

const middlewares: Middleware[] = [];

if (["dev", "local"].includes(import.meta.env.VITE_ENV || "production")) {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    titles: titlesReducer,
    scripts: scriptsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
