import { packagingService } from "@/service/packaging";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { handleToast } from "@/utils/toast";
import { RegenerateItemResponse } from "@/types/feature/packaging";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const generateTitle = createAsyncThunk(
  "packaging/generateTitle",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;
      const response = await packagingService.generateTitle(script);
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
      const state = thunkAPI.getState() as RootState;
      const { script, titles } = state.packaging;
      const selectedTitle = titles.titles[titles.selectedIndex]?.title ?? "";
      const response = await packagingService.generateDescription(
        script,
        selectedTitle
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
      const state = thunkAPI.getState() as RootState;
      const { script, titles } = state.packaging;
      const selectedTitle = titles.titles[titles.selectedIndex]?.title ?? "";
      const response = await packagingService.generateThumbnail(
        script,
        selectedTitle
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

/** @deprecated Uses legacy stateless hooks endpoint. Migrate to hooks.thunk.ts when videoProjectId is available. */
export const generateHooks = createAsyncThunk(
  "packaging/generateHooks",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;
      const response = await packagingService.generateHooks(script);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Generate first shorts script (used in generateAll)
export const generateShorts = createAsyncThunk(
  "packaging/generateShorts",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;
      const response = await packagingService.generateShorts(script);
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
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;
      const response = await packagingService.generateShorts(script);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

/** @deprecated Uses legacy stateless hooks endpoint via packagingService.generateHooks(). Migrate to hooks.thunk.ts when videoProjectId is available. */
export const generateAllPackaging = createAsyncThunk(
  "packaging/generateAll",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;

      // Call generateTitleDependentContent (title first, then description, thumbnail, shorts in parallel)
      // and generateHooks in parallel
      const [titleDependentContent, hooksResponse] = await Promise.all([
        packagingService.generateTitleDependentContent(script),
        packagingService.generateHooks(script),
      ]);

      return {
        title: titleDependentContent.title,
        description: titleDependentContent.description,
        thumbnail: titleDependentContent.thumbnail,
        shorts: titleDependentContent.shorts,
        hooks: hooksResponse.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const generateAllPackagingForProject = createAsyncThunk(
  "packaging/generateAllForProject",
  async (
    { script, videoProjectId }: { script: string; videoProjectId?: string },
    thunkAPI
  ) => {
    try {
      const result = await packagingService.generateTitleDependentContent(
        script,
        60,
        videoProjectId
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
      const { script, titles, description, thumbnails, hooks, shortsScript } =
        state.packaging;

      const response = await packagingService.savePackaging({
        ...(videoProjectId !== undefined && { videoProjectId }),
        script,
        titles: titles.titles,
        selectedTitleIndex: titles.selectedIndex,
        description: description.content,
        thumbnail: thumbnails.descriptions,
        selectedThumbnailIndex: thumbnails.selectedIndex,
        hooks: hooks.hooks,
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
    script: string;
    title?: string;
    duration?: number;
  }
>(
  "packaging/regenerateItem",
  async (arg, thunkAPI) => {
    try {
      const { packagingId, item, script, title, duration } = arg;
      // The hook is resolved server-side from the videoProjectId stored on the
      // packaging document — nothing hook-related is sent from the client.
      const response = await packagingService.regenerateItem(
        packagingId,
        item,
        { script, title, duration }
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

export const submitPackagingFeedback = createAsyncThunk(
  "packaging/submitFeedback",
  async (
    arg: {
      packagingId: string;
      item: "title" | "description" | "thumbnail" | "shorts";
      feedback: "like" | "dislike" | null;
    },
    thunkAPI
  ) => {
    try {
      const { packagingId, item, feedback } = arg;
      const response = await packagingService.submitFeedback(
        packagingId,
        item,
        feedback
      );
      handleToast({ message: response.message ?? "", warning: response.warning ?? "" });
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
