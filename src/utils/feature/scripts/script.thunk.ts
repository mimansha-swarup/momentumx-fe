import { scriptService } from "@/service/script";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleToast } from "@/utils/toast";
import { IGeneratedScript } from "@/types/feature/script";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const retrieveScripts = createAsyncThunk<
  IGeneratedScript[] | undefined,
  void,
  { rejectValue: string }
>(
  "scripts/retrieveScripts",
  async (_, thunkAPI) => {
    try {
      const response = await scriptService.getGeneratedScript();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getScriptById = createAsyncThunk<
  IGeneratedScript | undefined,
  string,
  { rejectValue: string }
>(
  "scripts/getScriptById",
  async (scriptId, thunkAPI) => {
    try {
      const response = await scriptService.getScriptById(scriptId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const editScript = createAsyncThunk<
  IGeneratedScript | undefined,
  { scriptId: string; script: string },
  { rejectValue: string }
>(
  "scripts/editScript",
  async ({ scriptId, script }, thunkAPI) => {
    try {
      const response = await scriptService.editScript(scriptId, { script });
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

type FeedbackValue = "like" | "dislike" | null;

export const submitScriptFeedback = createAsyncThunk<
  { id: string; userFeedback: FeedbackValue } | undefined,
  { scriptId: string; feedback: FeedbackValue },
  { rejectValue: string }
>(
  "scripts/submitFeedback",
  async ({ scriptId, feedback }, thunkAPI) => {
    try {
      const response = await scriptService.submitFeedback(scriptId, feedback);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const exportScript = createAsyncThunk<
  { title: string; text: string } | undefined,
  string,
  { rejectValue: string }
>(
  "scripts/exportScript",
  async (scriptId, thunkAPI) => {
    try {
      const response = await scriptService.exportScript(scriptId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const regenerateScript = createAsyncThunk<
  { id: string; title: string; script: string } | undefined,
  string,
  { rejectValue: string }
>(
  "scripts/regenerateScript",
  async (scriptId, thunkAPI) => {
    try {
      const response = await scriptService.regenerateScript(scriptId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
