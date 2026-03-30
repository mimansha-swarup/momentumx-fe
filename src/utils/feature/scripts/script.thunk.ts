import { scriptService } from "@/service/script";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleToast } from "@/utils/toast";

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

export const editScript = createAsyncThunk(
  "scripts/editScript",
  async (
    { scriptId, script }: { scriptId: string; script: string },
    thunkAPI
  ) => {
    try {
      const response = await scriptService.editScript(scriptId, { script });
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const submitScriptFeedback = createAsyncThunk(
  "scripts/submitFeedback",
  async (
    {
      scriptId,
      feedback,
    }: { scriptId: string; feedback: "like" | "dislike" | null },
    thunkAPI
  ) => {
    try {
      const response = await scriptService.submitFeedback(scriptId, feedback);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const exportScript = createAsyncThunk(
  "scripts/exportScript",
  async (scriptId: string, thunkAPI) => {
    try {
      const response = await scriptService.exportScript(scriptId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const regenerateScript = createAsyncThunk(
  "scripts/regenerateScript",
  async (scriptId: string, thunkAPI) => {
    try {
      const response = await scriptService.regenerateScript(scriptId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
