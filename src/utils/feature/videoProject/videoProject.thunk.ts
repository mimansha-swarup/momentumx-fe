import { videoProjectService } from "@/service/videoProject";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ListProjectsParams,
  ResourceType,
  StepName,
  CreateProjectRequest,
} from "@/types/feature/videoProject";

import { getErrorMessage } from "@/utils/error";

export const createProject = createAsyncThunk(
  "videoProject/create",
  async (payload: CreateProjectRequest, thunkAPI) => {
    try {
      const response = await videoProjectService.createProject(payload);
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
      if (response.warning) {
        handleToast({ message: "", warning: response.warning });
      }
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
      if (response.warning) {
        handleToast({ message: "", warning: response.warning });
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateWorkingTitle = createAsyncThunk(
  "videoProject/updateTitle",
  async (
    { projectId, title }: { projectId: string; title: string },
    thunkAPI
  ) => {
    try {
      const response = await videoProjectService.updateWorkingTitle(
        projectId,
        title
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

// No startStep thunk: the backend generation endpoints (script stream, hooks
// generate, packaging save) set in_progress server-side.

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
