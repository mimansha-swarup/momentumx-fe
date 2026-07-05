import { createAsyncThunk } from "@reduxjs/toolkit";
import { titleGeneratorService } from "@/service/titleGenerator";
import { handleToast } from "@/utils/toast";
import { ITitleGeneratorPayload } from "@/types/feature/titleGenerator";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const generateTitles = createAsyncThunk(
  "titleGenerator/generate",
  async (payload: ITitleGeneratorPayload, thunkAPI) => {
    try {
      const response = await titleGeneratorService.generate(payload);
      handleToast({ message: response?.message ?? "", warning: response?.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deepGenerateTitles = createAsyncThunk(
  "titleGenerator/deepGenerate",
  async (payload: ITitleGeneratorPayload, thunkAPI) => {
    try {
      const response = await titleGeneratorService.deepGenerate(payload);
      handleToast({ message: response?.message ?? "", warning: response?.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
