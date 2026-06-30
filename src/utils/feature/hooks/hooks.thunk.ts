import { hooksService } from "@/service/hooks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeedbackValue } from "@/types/feature/hooks";
import { handleToast } from "@/utils/toast";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const generateHooks = createAsyncThunk(
  "hooks/generate",
  async (
    { videoProjectId, script }: { videoProjectId: string; script: string },
    thunkAPI
  ) => {
    try {
      const response = await hooksService.generateHooks(
        videoProjectId,
        script
      );
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const selectHook = createAsyncThunk(
  "hooks/select",
  async (
    {
      hooksId,
      hookIndex,
    }: { hooksId: string; hookIndex: number },
    thunkAPI
  ) => {
    try {
      const response = await hooksService.selectHook(hooksId, hookIndex);
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const regenerateHooks = createAsyncThunk(
  "hooks/regenerate",
  async (
    { hooksId, script }: { hooksId: string; script: string },
    thunkAPI
  ) => {
    try {
      const response = await hooksService.regenerateHooks(hooksId, script);
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const submitHookFeedback = createAsyncThunk(
  "hooks/feedback",
  async (
    {
      hooksId,
      hookIndex,
      feedback,
    }: { hooksId: string; hookIndex: number; feedback: FeedbackValue },
    thunkAPI
  ) => {
    try {
      const response = await hooksService.submitFeedback(
        hooksId,
        hookIndex,
        feedback
      );
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const exportHooks = createAsyncThunk(
  "hooks/export",
  async (hooksId: string, thunkAPI) => {
    try {
      const response = await hooksService.exportHooks(hooksId);
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
