import { configureStore, Middleware } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import userReducer from "@/utils/feature/user/user.slice";
import titlesReducer from "@/utils/feature/titles/titles.slice";
import scriptsReducer from "@/utils/feature/scripts/script.slice";
import packagingReducer from "@/utils/feature/packaging/packaging.slice";
import videoProjectReducer from "@/utils/feature/videoProject/videoProject.slice";
import hooksReducer from "@/utils/feature/hooks/hooks.slice";
import researchReducer from "@/utils/feature/research/research.slice";
import titleGeneratorReducer from "@/utils/feature/titleGenerator/titleGenerator.slice";

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
    titleGenerator: titleGeneratorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
