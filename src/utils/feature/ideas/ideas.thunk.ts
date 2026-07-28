import { ideaService, IdeasListParams, IIdeaContextOverride } from "@/service/ideas";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/utils/error";

type RetrieveTitlesParams = IdeasListParams & { isFresh?: boolean };

export const retrieveIdeas = createAsyncThunk(
  "ideas/retrieveIdeas",
  async (filter: RetrieveTitlesParams | undefined, thunkAPI) => {
    try {
      const { isFresh, ...restFilter } = filter || {};
      const response = await ideaService.getGeneratedData(restFilter);
      return { data: response?.data, isFresh };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
export const generateIdeas = createAsyncThunk(
  "ideas/generateIdeas",
  async (context: IIdeaContextOverride | undefined, thunkAPI) => {
    try {
      const response = await ideaService.generateIdeas(context);
      handleToast({ message: response?.message ?? "", warning: response?.warning ?? "" });
      return { data: response?.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
export const editIdeas = createAsyncThunk(
  "ideas/editIdeas",
  async ({ ideaId, title }: { ideaId: string; title: string }, thunkAPI) => {
    try {
      const response = await ideaService.editIdea(ideaId, { title });
      handleToast({ message: response?.message ?? "", warning: response?.warning ?? "" });
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const regenerateAllIdeas = createAsyncThunk(
  "ideas/regenerateAllIdeas",
  async (_, thunkAPI) => {
    try {
      const response = await ideaService.regenerateAll();
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const regenerateOneIdea = createAsyncThunk(
  "ideas/regenerateOneIdea",
  async (ideaId: string, thunkAPI) => {
    try {
      const response = await ideaService.regenerateOne(ideaId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const exportIdeas = createAsyncThunk(
  "ideas/exportIdeas",
  async (_, thunkAPI) => {
    try {
      const response = await ideaService.exportIdeas();
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
