import { configureStore, Middleware } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import userReducer from "../feature/user/user.slice";
import titlesReducer from "../feature/titles/titles.slice";
import scriptsReducer from "../feature/scripts/script.slice";
import packagingReducer from "../feature/packaging/packaging.slice";
import videoProjectReducer from "../feature/videoProject/videoProject.slice";
import hooksReducer from "../feature/hooks/hooks.slice";
import researchReducer from "../feature/research/research.slice";

const middlewares: Middleware[] = [];

if (["dev", "local"].includes(import.meta.env.VITE_ENV || "production")) {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    titles: titlesReducer,
    scripts: scriptsReducer,
    packaging: packagingReducer,
    videoProject: videoProjectReducer,
    hooks: hooksReducer,
    research: researchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
