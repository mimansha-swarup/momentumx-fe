import { titleService } from "@/service/titles";

import { createAsyncThunk } from "@reduxjs/toolkit";



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
