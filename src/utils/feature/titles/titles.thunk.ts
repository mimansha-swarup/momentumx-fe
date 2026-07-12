import { titleService, IdeasListParams, IIdeaContextOverride } from "@/service/titles";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/utils/error";

type RetrieveTitlesParams = IdeasListParams & { isFresh?: boolean };

export const retrieveTitles = createAsyncThunk(
  "titles/retrieveTitles",
  async (filter: RetrieveTitlesParams | undefined, thunkAPI) => {
    try {
      const { isFresh, ...restFilter } = filter || {};
      const response = await titleService.getGeneratedData(restFilter);
      return { data: response?.data, isFresh };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
export const generateTitles = createAsyncThunk(
  "titles/generateTitles",
  async (context: IIdeaContextOverride | undefined, thunkAPI) => {
    try {
      const response = await titleService.generateTitles(context);
      handleToast({ message: response?.message ?? "", warning: response?.warning ?? "" });
      return { data: response?.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
export const editTitles = createAsyncThunk(
  "titles/editTitles",
  async ({ titleId, title }: { titleId: string; title: string }, thunkAPI) => {
    try {
      const response = await titleService.editTitle(titleId, { title });
      handleToast({ message: response?.message ?? "", warning: response?.warning ?? "" });
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const regenerateAllIdeas = createAsyncThunk(
  "titles/regenerateAllIdeas",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.regenerateAll();
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const regenerateOneIdea = createAsyncThunk(
  "titles/regenerateOneIdea",
  async (ideaId: string, thunkAPI) => {
    try {
      const response = await titleService.regenerateOne(ideaId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const exportIdeas = createAsyncThunk(
  "titles/exportIdeas",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.exportIdeas();
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
