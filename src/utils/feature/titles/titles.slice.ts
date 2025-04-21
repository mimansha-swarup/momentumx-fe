import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { retrieveTitles } from "./titles.thunk";
import { ITitleState } from "@/types/feature/title";

const initialState: ITitleState = {
  data: null,
  isLoading: false,
  isDone: false,
};
const titlesSlice = createSlice({
  name: "titles",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isDone = false;
      state.isLoading = true;
    },
    addTitle: (state, action) => {
      state.data = [action.payload, ...(state.data ?? [])];
    },

    markDone: (state) => {
      state.isDone = true;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder

      .addCase(retrieveTitles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveTitles.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(retrieveTitles.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetState, addTitle, markDone } = titlesSlice.actions;

export const rootTitle = (state: RootState) => state.titles;
export const getTitlesData = (state: RootState) => state.titles.data;
export const titlesLoading = (state: RootState) => state.titles.isLoading;
export const titlesDone = (state: RootState) => state.titles.isDone;

export default titlesSlice.reducer;
