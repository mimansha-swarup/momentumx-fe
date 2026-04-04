import { videoProjectService } from "@/service/videoProject";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ListProjectsParams,
  ResourceType,
  StepName,
} from "@/types/feature/videoProject";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const createProject = createAsyncThunk(
  "videoProject/create",
  async (topicId: string, thunkAPI) => {
    try {
      const response = await videoProjectService.createProject(topicId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const listProjects = createAsyncThunk(
  "videoProject/list",
  async (params: ListProjectsParams | undefined, thunkAPI) => {
    try {
      const response = await videoProjectService.listProjects(params);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return { data: response.data, params };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getProject = createAsyncThunk(
  "videoProject/get",
  async (projectId: string, thunkAPI) => {
    try {
      const response = await videoProjectService.getProject(projectId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateWorkingTitle = createAsyncThunk(
  "videoProject/updateTitle",
  async (
    { projectId, workingTitle }: { projectId: string; workingTitle: string },
    thunkAPI
  ) => {
    try {
      const response = await videoProjectService.updateWorkingTitle(
        projectId,
        workingTitle
      );
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProject = createAsyncThunk(
  "videoProject/delete",
  async (projectId: string, thunkAPI) => {
    try {
      const response = await videoProjectService.deleteProject(projectId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const startStep = createAsyncThunk(
  "videoProject/startStep",
  async (
    { projectId, stepName }: { projectId: string; stepName: StepName },
    thunkAPI
  ) => {
    try {
      const response = await videoProjectService.startStep(
        projectId,
        stepName
      );
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const completeStep = createAsyncThunk(
  "videoProject/completeStep",
  async (
    { projectId, stepName }: { projectId: string; stepName: StepName },
    thunkAPI
  ) => {
    try {
      const response = await videoProjectService.completeStep(
        projectId,
        stepName
      );
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const linkResource = createAsyncThunk(
  "videoProject/linkResource",
  async (
    {
      projectId,
      resourceType,
      resourceId,
    }: {
      projectId: string;
      resourceType: ResourceType;
      resourceId: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await videoProjectService.linkResource(
        projectId,
        resourceType,
        resourceId
      );
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
