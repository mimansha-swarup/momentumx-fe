import { scriptService } from "@/service/script";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const retrieveScripts = createAsyncThunk(
  "scripts/retrieveScripts",
  async (_, thunkAPI) => {
    try {
      const response = await scriptService.getGeneratedScript();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
