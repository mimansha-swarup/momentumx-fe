import { packagingService } from "@/service/packaging";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { handleToast, toastError } from "@/utils/toast";
import { RegenerateItemResponse } from "@/types/feature/packaging";
import { getProject } from "@/utils/feature/videoProject/videoProject.thunk";

import { getErrorMessage } from "@/utils/error";

// §7.3 title continuity: persist the chosen title; the server renames the
// project, so refresh it to reflect the finalized title in the header/dashboard.
export const selectPackagingTitle = createAsyncThunk(
  "packaging/selectTitle",
  async (
    { packagingId, index, projectId }: { packagingId: string; index: number; projectId?: string },
    thunkAPI
  ) => {
    try {
      const response = await packagingService.selectTitle(packagingId, index);
      if (projectId) thunkAPI.dispatch(getProject(projectId));
      return response?.data;
    } catch (error) {
      // Surface the failure — otherwise the optimistic local selection silently
      // diverges from the (un-persisted) server state with no user feedback.
      toastError("Couldn't save your title selection");
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// The generate thunks send only videoProjectId — script, hook, and channel
// context are resolved server-side from the project.
const currentProjectId = (thunkAPI: { getState: () => unknown }): string => {
  const state = thunkAPI.getState() as RootState;
  return state.videoProject.currentProject?.id ?? "";
};

export const generateTitle = createAsyncThunk(
  "packaging/generateTitle",
  async (_, thunkAPI) => {
    try {
      const projectId = currentProjectId(thunkAPI);
      if (!projectId) return thunkAPI.rejectWithValue("No project loaded");
      const response = await packagingService.generateTitle(projectId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const generateDescription = createAsyncThunk(
  "packaging/generateDescription",
  async (_, thunkAPI) => {
    try {
      const projectId = currentProjectId(thunkAPI);
      if (!projectId) return thunkAPI.rejectWithValue("No project loaded");
      const state = thunkAPI.getState() as RootState;
      const { titles } = state.packaging;
      const selectedTitle = titles.titles[titles.selectedIndex]?.title ?? "";
      const response = await packagingService.generateDescription(
        selectedTitle,
        projectId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const generateThumbnail = createAsyncThunk(
  "packaging/generateThumbnail",
  async (_, thunkAPI) => {
    try {
      const projectId = currentProjectId(thunkAPI);
      if (!projectId) return thunkAPI.rejectWithValue("No project loaded");
      const state = thunkAPI.getState() as RootState;
      const { titles } = state.packaging;
      const selectedTitle = titles.titles[titles.selectedIndex]?.title ?? "";
      const response = await packagingService.generateThumbnail(
        selectedTitle,
        projectId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Regenerate the single shorts script
export const regenerateShortsScript = createAsyncThunk(
  "packaging/regenerateShortsScript",
  async (_, thunkAPI) => {
    try {
      const projectId = currentProjectId(thunkAPI);
      if (!projectId) return thunkAPI.rejectWithValue("No project loaded");
      const response = await packagingService.generateShorts(projectId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const generateAllPackagingForProject = createAsyncThunk(
  "packaging/generateAllForProject",
  async ({ videoProjectId }: { videoProjectId: string }, thunkAPI) => {
    try {
      const result = await packagingService.generateTitleDependentContent(
        videoProjectId,
        60
      );
      return {
        title: result.title,
        description: result.description,
        thumbnail: result.thumbnail,
        shorts: result.shorts,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const savePackaging = createAsyncThunk(
  "packaging/save",
  async (videoProjectId: string | undefined, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { titles, description, thumbnails, shortsScript } =
        state.packaging;

      // No script/hooks in the payload: the server resolves both from the
      // project — sending browser state here used to persist empty snapshots.
      const response = await packagingService.savePackaging({
        ...(videoProjectId !== undefined && { videoProjectId }),
        titles: titles.titles,
        selectedTitleIndex: titles.selectedIndex,
        description: description.content,
        thumbnail: thumbnails.descriptions,
        selectedThumbnailIndex: thumbnails.selectedIndex,
        shorts: {
          segments: shortsScript.segments,
          totalDuration: shortsScript.totalDuration,
        },
      });
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const listPackaging = createAsyncThunk(
  "packaging/list",
  async (_, thunkAPI) => {
    try {
      const response = await packagingService.listPackaging();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getPackaging = createAsyncThunk(
  "packaging/get",
  async (packagingId: string, thunkAPI) => {
    try {
      const response = await packagingService.getPackaging(packagingId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const regenerateItem = createAsyncThunk<
  RegenerateItemResponse,
  {
    packagingId: string;
    item: "title" | "description" | "thumbnail" | "shorts";
    title?: string;
    duration?: number;
  }
>(
  "packaging/regenerateItem",
  async (arg, thunkAPI) => {
    try {
      const { packagingId, item, title, duration } = arg;
      // Script and hook are resolved server-side from the videoProjectId stored
      // on the packaging document — the client sends only per-item params.
      const response = await packagingService.regenerateItem(
        packagingId,
        item,
        { title, duration }
      );
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      if (!response.data) {
        return thunkAPI.rejectWithValue("No data returned");
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const exportPackaging = createAsyncThunk(
  "packaging/export",
  async (packagingId: string, thunkAPI) => {
    try {
      const response = await packagingService.exportPackaging(packagingId);
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
