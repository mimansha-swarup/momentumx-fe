import { scriptService } from "@/service/script";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const retrieveScripts = createAsyncThunk(
  "scripts/retrieveScripts",
  async (_, thunkAPI) => {
    try {
      const response = await scriptService.getGeneratedScript();
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editScript = createAsyncThunk(
  "scripts/editScript",
  async (
    { scriptId, ...script }: Record<string, string | number>,
    thunkAPI
  ) => {
    try {
      const response = await scriptService.editScript(
        scriptId as string,
        script
      );
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
