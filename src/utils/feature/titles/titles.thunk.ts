import { TitleService } from "@/service/titles";

import { createAsyncThunk } from "@reduxjs/toolkit";

const titleService = new TitleService();

export const generateTitles = createAsyncThunk(
  "titles/generateTitles",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.generateTitles();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const retrieveTitles = createAsyncThunk(
  "titles/retrieveTitles",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.getGeneratedData();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
