import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { IResearchState } from "@/types/feature/research";
import {
  fetchTrending,
  fetchCompetitors,
  fetchKeywords,
} from "./research.thunk";

const initialState: IResearchState = {
  trending: { videos: [], isLoading: false, error: null },
  competitors: { channels: [], isLoading: false, error: null },
  keywords: { results: [], isLoading: false, error: null },
};

const researchSlice = createSlice({
  name: "research",
  initialState,
  reducers: {
    clearResearch: () => initialState,
    clearKeywords: (state) => {
      state.keywords = initialState.keywords;
    },
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrending.pending, (state) => {
        state.trending.isLoading = true;
        state.trending.error = null;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending.isLoading = false;
        state.trending.videos = action.payload ?? [];
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.trending.isLoading = false;
        state.trending.error = action.payload as string;
      })

      // Competitors
      .addCase(fetchCompetitors.pending, (state) => {
        state.competitors.isLoading = true;
        state.competitors.error = null;
      })
      .addCase(fetchCompetitors.fulfilled, (state, action) => {
        state.competitors.isLoading = false;
        state.competitors.channels = action.payload ?? [];
      })
      .addCase(fetchCompetitors.rejected, (state, action) => {
        state.competitors.isLoading = false;
        state.competitors.error = action.payload as string;
      })

      // Keywords
      .addCase(fetchKeywords.pending, (state) => {
        state.keywords.isLoading = true;
        state.keywords.error = null;
      })
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.keywords.isLoading = false;
        state.keywords.results = action.payload ?? [];
      })
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.keywords.isLoading = false;
        state.keywords.error = action.payload as string;
      });
  },
});

export const { clearResearch, clearKeywords } = researchSlice.actions;

export const selectTrending = (state: RootState) => state.research.trending;
export const selectCompetitors = (state: RootState) =>
  state.research.competitors;
export const selectKeywords = (state: RootState) => state.research.keywords;

export default researchSlice.reducer;
