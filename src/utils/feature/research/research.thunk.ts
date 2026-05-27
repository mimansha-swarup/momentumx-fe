import { researchService } from "@/service/research";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const fetchTrending = createAsyncThunk(
  "research/fetchTrending",
  async (_, thunkAPI) => {
    try {
      const response = await researchService.getTrending();
      if (response.warning) {
        handleToast({ message: "", warning: response.warning });
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCompetitors = createAsyncThunk(
  "research/fetchCompetitors",
  async (_, thunkAPI) => {
    try {
      const response = await researchService.getCompetitors();
      if (response.warning) {
        handleToast({ message: "", warning: response.warning });
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchKeywords = createAsyncThunk(
  "research/fetchKeywords",
  async (query: string, thunkAPI) => {
    try {
      const response = await researchService.getKeywords(query);
      if (response.warning) {
        handleToast({ message: "", warning: response.warning });
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
