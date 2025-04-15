import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { generateTitles, retrieveTitles } from "./titles.thunk";
import { ITitleState } from "@/types/feature/title";

const initialState: ITitleState = {
  data: null,
  isLoading: false,
};
const titlesSlice = createSlice({
  name: "titles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(generateTitles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateTitles.fulfilled, (state, action) => {
        state.data = [...(state.data ?? []), ...action.payload];
        state.isLoading = false;
      })
      .addCase(generateTitles.rejected, (state) => {
        state.isLoading = false;
      })
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

export const rootTitle = (state: RootState) => state.titles;
export const getTitlesData = (state: RootState) => state.titles.data;
export const titlesLoading = (state: RootState) => state.titles.isLoading;

export default titlesSlice.reducer;
