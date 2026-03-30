import { researchService } from "@/service/research";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTrending = createAsyncThunk(
  "research/fetchTrending",
  async (_, thunkAPI) => {
    try {
      const response = await researchService.getTrending();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchCompetitors = createAsyncThunk(
  "research/fetchCompetitors",
  async (_, thunkAPI) => {
    try {
      const response = await researchService.getCompetitors();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchKeywords = createAsyncThunk(
  "research/fetchKeywords",
  async (query: string, thunkAPI) => {
    try {
      const response = await researchService.getKeywords(query);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
