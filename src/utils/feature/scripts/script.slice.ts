import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { retrieveScripts } from "./script.thunk";
import { IScriptState } from "@/types/feature/script";

const initialState: IScriptState = {
  data: null,
  isLoading: false,
  isDone: false,
};
const scriptsSlice = createSlice({
  name: "scripts",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isDone = false;
      state.isLoading = true;
    },
    addScript: (state, action) => {
      state.data = [action.payload, ...(state.data ?? [])];
    },

    markDone: (state) => {
      state.isDone = true;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveScripts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveScripts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(retrieveScripts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetState, addScript, markDone } = scriptsSlice.actions;

export const rootScripts = (state: RootState) => state.scripts;
export const getScriptsData = (state: RootState) => state.scripts.data;
export const scriptsLoading = (state: RootState) => state.scripts.isLoading;
export const scriptsDone = (state: RootState) => state.scripts.isDone;

export default scriptsSlice.reducer;
