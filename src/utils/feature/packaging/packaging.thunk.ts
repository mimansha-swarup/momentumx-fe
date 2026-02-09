import { packagingService } from "@/service/packaging";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { ITimestampedSegment } from "@/types/feature/packaging";

export const generateTitle = createAsyncThunk(
  "packaging/generateTitle",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;
      const response = await packagingService.generateTitle(script);
      return response;
    } catch (error) {
      console.error("Error generating title:", error);
      return thunkAPI.rejectWithValue("Failed to generate title");
    }
  },
);

export const generateDescription = createAsyncThunk(
  "packaging/generateDescription",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script, title } = state.packaging;
      const response = await packagingService.generateDescription(
        script,
        title.content || undefined,
      );
      return response;
    } catch (error) {
      console.error("Error generating description:", error);
      return thunkAPI.rejectWithValue("Failed to generate description");
    }
  },
);

export const generateThumbnail = createAsyncThunk(
  "packaging/generateThumbnail",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script, title } = state.packaging;
      const response = await packagingService.generateThumbnail(
        script,
        title.content || undefined,
      );
      return response;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return thunkAPI.rejectWithValue(
        "Failed to generate thumbnail description",
      );
    }
  },
);

export const generateHooks = createAsyncThunk(
  "packaging/generateHooks",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;
      const response = await packagingService.generateHooks(script);
      return response;
    } catch (error) {
      console.error("Error generating hooks:", error);
      return thunkAPI.rejectWithValue("Failed to generate hooks");
    }
  },
);

// Generate first shorts script (used in generateAll)
export const generateShorts = createAsyncThunk(
  "packaging/generateShorts",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script } = state.packaging;
      const response = await packagingService.generateShorts(script, 0);
      return response;
    } catch (error) {
      console.error("Error generating shorts script:", error);
      return thunkAPI.rejectWithValue("Failed to generate shorts script");
    }
  },
);

// Add a new shorts script (up to 5 total)
export const addNewShortsScript = createAsyncThunk(
  "packaging/addNewShortsScript",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script, shortsScript } = state.packaging;
      const variant = shortsScript.scripts.length; // Use current count as variant
      const response = await packagingService.generateShorts(script, variant);
      return response;
    } catch (error) {
      console.error("Error generating new shorts script:", error);
      return thunkAPI.rejectWithValue("Failed to generate shorts script");
    }
  },
);

// Regenerate a specific shorts script by ID
export const regenerateShortsScript = createAsyncThunk(
  "packaging/regenerateShortsScript",
  async (scriptId: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script, shortsScript } = state.packaging;
      const scriptIndex = shortsScript.scripts.findIndex(
        (s) => s.id === scriptId,
      );
      // Use a different variant for regeneration
      const variant = (scriptIndex + Math.floor(Math.random() * 4) + 1) % 5;
      const response = await packagingService.generateShorts(script, variant);
      return {
        id: scriptId,
        segments: response.segments,
      };
    } catch (error) {
      console.error("Error regenerating shorts script:", error);
      return thunkAPI.rejectWithValue("Failed to regenerate shorts script");
    }
  },
);

export const generateAllPackaging = createAsyncThunk(
  "packaging/generateAll",
  async (_, thunkAPI) => {
    try {
      // Dispatch all generation thunks in parallel
      await Promise.all([
        thunkAPI.dispatch(generateTitle()),
        thunkAPI.dispatch(generateDescription()),
        thunkAPI.dispatch(generateThumbnail()),
        thunkAPI.dispatch(generateHooks()),
        thunkAPI.dispatch(generateShorts()),
      ]);
      return true;
    } catch (error) {
      console.error("Error generating all packaging:", error);
      return thunkAPI.rejectWithValue("Failed to generate packaging");
    }
  },
);

export const savePackaging = createAsyncThunk(
  "packaging/save",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const {
        script,
        title,
        description,
        thumbnailDescription,
        hooks,
        shortsScript,
      } = state.packaging;

      const response = await packagingService.savePackaging({
        script,
        title: title.content,
        description: description.content,
        thumbnailDescription: thumbnailDescription.content,
        hooks: {
          openingLine: hooks.openingLine,
          patternInterrupt: hooks.patternInterrupt,
          ctaHook: hooks.ctaHook,
        },
        shortsScripts: shortsScript.scripts.map((s) => ({
          id: s.id,
          segments: s.segments,
        })),
      });
      return response;
    } catch (error) {
      console.error("Error saving packaging:", error);
      return thunkAPI.rejectWithValue("Failed to save packaging");
    }
  },
);
