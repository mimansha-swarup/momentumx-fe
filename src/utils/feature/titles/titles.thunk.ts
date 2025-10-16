import { titleService } from "@/service/titles";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const retrieveTitles = createAsyncThunk(
  "titles/retrieveTitles",
  async (filter: Record<string, unknown> | undefined, thunkAPI) => {
    try {
      const { isFresh, ...resetFilter } = filter || {};
      const response = await titleService.getGeneratedData(resetFilter);
      return { data: response.data, isFresh };
    } catch (error) {
      console.log("error: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const generateTitles = createAsyncThunk(
  "titles/generateTitles",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.generateTitles();
      return { data: response.data };
    } catch (error) {
      console.log("error: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editTitles = createAsyncThunk(
  "titles/editTitles",
  async ({ titleId, ...record }: Record<string, unknown>, thunkAPI) => {
    try {
      const response = await titleService.editTitle(titleId as string, record);
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
