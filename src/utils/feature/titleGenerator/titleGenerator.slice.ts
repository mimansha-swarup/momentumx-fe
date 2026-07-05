import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { ITitleGeneratorState } from "@/types/feature/titleGenerator";
import { generateTitles, deepGenerateTitles } from "./titleGenerator.thunk";

const initialState: ITitleGeneratorState = {
  result: null,
  generationMode: null,
  isLoading: false,
  isDeepLoading: false,
  error: null,
};

const titleGeneratorSlice = createSlice({
  name: "titleGenerator",
  initialState,
  reducers: {
    clearResult: (state) => {
      state.result = null;
      state.generationMode = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTitles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateTitles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload ?? null;
        state.generationMode = "normal";
      })
      .addCase(generateTitles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      .addCase(deepGenerateTitles.pending, (state) => {
        state.isDeepLoading = true;
        state.error = null;
      })
      .addCase(deepGenerateTitles.fulfilled, (state, action) => {
        state.isDeepLoading = false;
        state.result = action.payload ?? null;
        state.generationMode = "deep";
      })
      .addCase(deepGenerateTitles.rejected, (state, action) => {
        state.isDeepLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      });
  },
});

export const { clearResult } = titleGeneratorSlice.actions;

export const selectTitleGeneratorResult = (state: RootState) => state.titleGenerator.result;
export const selectTitleGeneratorIsLoading = (state: RootState) => state.titleGenerator.isLoading;
export const selectTitleGeneratorIsDeepLoading = (state: RootState) => state.titleGenerator.isDeepLoading;
export const selectTitleGeneratorError = (state: RootState) => state.titleGenerator.error;
export const selectTitleGeneratorTitles = (state: RootState) => state.titleGenerator.result?.titles ?? [];
export const selectTitleGeneratorAnalysis = (state: RootState) => state.titleGenerator.result?.analysis ?? null;
export const selectTitleGeneratorMode = (state: RootState) => state.titleGenerator.generationMode;

export default titleGeneratorSlice.reducer;
