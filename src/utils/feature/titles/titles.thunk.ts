import { titleService, TopicsListParams } from "@/service/titles";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

type RetrieveTitlesParams = TopicsListParams & { isFresh?: boolean };

export const retrieveTitles = createAsyncThunk(
  "titles/retrieveTitles",
  async (filter: RetrieveTitlesParams | undefined, thunkAPI) => {
    try {
      const { isFresh, ...restFilter } = filter || {};
      const response = await titleService.getGeneratedData(restFilter);
      return { data: response?.data, isFresh };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const generateTitles = createAsyncThunk(
  "titles/generateTitles",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.generateTitles();
      handleToast({ message: response?.message ?? "", warning: response?.warning ?? "" });
      return { data: response?.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const regenerateAllTopics = createAsyncThunk(
  "titles/regenerateAllTopics",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.regenerateAll();
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const regenerateOneTopic = createAsyncThunk(
  "titles/regenerateOneTopic",
  async (topicId: string, thunkAPI) => {
    try {
      const response = await titleService.regenerateOne(topicId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const submitTopicFeedback = createAsyncThunk(
  "titles/submitTopicFeedback",
  async (
    { topicId, feedback }: { topicId: string; feedback: "like" | "dislike" | null },
    thunkAPI
  ) => {
    try {
      const response = await titleService.submitFeedback(topicId, feedback);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const exportTopics = createAsyncThunk(
  "titles/exportTopics",
  async (_, thunkAPI) => {
    try {
      const response = await titleService.exportTopics();
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
