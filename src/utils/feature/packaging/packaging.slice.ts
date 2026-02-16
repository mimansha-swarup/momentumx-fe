import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { IPackagingState, IShortsScript, MAX_SHORTS_SCRIPTS } from "@/types/feature/packaging";
import {
  generateTitle,
  generateDescription,
  generateThumbnail,
  generateHooks,
  generateShorts,
  addNewShortsScript,
  regenerateShortsScript,
  generateAllPackaging,
  savePackaging,
} from "./packaging.thunk";

const initialState: IPackagingState = {
  script: "",
  titles: {
    titles: [],
    selectedIndex: 0,
    isLoading: false,
    error: null,
  },
  description: {
    content: "",
    isLoading: false,
    error: null,
  },
  thumbnails: {
    descriptions: [],
    selectedIndex: 0,
    isLoading: false,
    error: null,
  },
  hooks: {
    hooks: [],
    isLoading: false,
    error: null,
  },
  shortsScript: {
    scripts: [],
    isAddingNew: false,
  },
  isSaving: false,
  savedAt: null,
  packagingId: null,
  isGeneratingAll: false,
};

const packagingSlice = createSlice({
  name: "packaging",
  initialState,
  reducers: {
    setScript: (state, action: PayloadAction<string>) => {
      state.script = action.payload;
    },
    // Title actions
    updateTitleVariation: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      const { index, value } = action.payload;
      if (state.titles.titles[index] !== undefined) {
        state.titles.titles[index].title = value;
      }
    },
    setSelectedTitle: (state, action: PayloadAction<number>) => {
      state.titles.selectedIndex = action.payload;
    },
    // Description actions
    updateDescription: (state, action: PayloadAction<string>) => {
      state.description.content = action.payload;
    },
    // Thumbnail actions (thumbnails are read-only, just selection)
    setSelectedThumbnail: (state, action: PayloadAction<number>) => {
      state.thumbnails.selectedIndex = action.payload;
    },
    // Hook actions (hooks are simple strings)
    updateHook: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      const { index, value } = action.payload;
      if (state.hooks.hooks[index] !== undefined) {
        state.hooks.hooks[index] = value;
      }
    },
    deleteHook: (state, action: PayloadAction<number>) => {
      state.hooks.hooks = state.hooks.hooks.filter(
        (_, index) => index !== action.payload
      );
    },
    // Shorts actions
    deleteShortsScript: (state, action: PayloadAction<string>) => {
      state.shortsScript.scripts = state.shortsScript.scripts.filter(
        (s) => s.id !== action.payload
      );
    },
    resetPackaging: () => initialState,
    clearErrors: (state) => {
      state.titles.error = null;
      state.description.error = null;
      state.thumbnails.error = null;
      state.hooks.error = null;
      state.shortsScript.scripts.forEach((s) => {
        s.error = null;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Titles (3 variations)
      .addCase(generateTitle.pending, (state) => {
        state.titles.isLoading = true;
        state.titles.error = null;
      })
      .addCase(generateTitle.fulfilled, (state, action) => {
        state.titles.isLoading = false;
        console.log("action.payload", action.payload);
        state.titles.titles = action.payload?.titles || [];
        state.titles.selectedIndex = 0;
      })
      .addCase(generateTitle.rejected, (state, action) => {
        state.titles.isLoading = false;
        state.titles.error = action.payload as string;
      })

      // Generate Description
      .addCase(generateDescription.pending, (state) => {
        state.description.isLoading = true;
        state.description.error = null;
      })
      .addCase(generateDescription.fulfilled, (state, action) => {
        state.description.isLoading = false;
        state.description.content = action.payload?.description || "";
      })
      .addCase(generateDescription.rejected, (state, action) => {
        state.description.isLoading = false;
        state.description.error = action.payload as string;
      })

      // Generate Thumbnails (3 variations)
      .addCase(generateThumbnail.pending, (state) => {
        state.thumbnails.isLoading = true;
        state.thumbnails.error = null;
      })
      .addCase(generateThumbnail.fulfilled, (state, action) => {
        state.thumbnails.isLoading = false;
        state.thumbnails.descriptions = action.payload?.descriptions || [];
        state.thumbnails.selectedIndex = 0;
      })
      .addCase(generateThumbnail.rejected, (state, action) => {
        state.thumbnails.isLoading = false;
        state.thumbnails.error = action.payload as string;
      })

      // Generate Hooks (multiple paragraphs)
      .addCase(generateHooks.pending, (state) => {
        state.hooks.isLoading = true;
        state.hooks.error = null;
      })
      .addCase(generateHooks.fulfilled, (state, action) => {
        state.hooks.isLoading = false;
        state.hooks.hooks = action.payload?.hooks || [];
      })
      .addCase(generateHooks.rejected, (state, action) => {
        state.hooks.isLoading = false;
        state.hooks.error = action.payload as string;
      })

      // Generate Shorts
      .addCase(generateShorts.pending, (state) => {
        const newScript: IShortsScript = {
          id: `shorts_${Date.now()}`,
          segments: [],
          isLoading: true,
          error: null,
        };
        state.shortsScript.scripts = [newScript];
      })
      .addCase(generateShorts.fulfilled, (state, action) => {
        if (state.shortsScript.scripts.length > 0) {
          state.shortsScript.scripts[0].isLoading = false;
          state.shortsScript.scripts[0].segments = action.payload?.segments || [];
        }
      })
      .addCase(generateShorts.rejected, (state, action) => {
        if (state.shortsScript.scripts.length > 0) {
          state.shortsScript.scripts[0].isLoading = false;
          state.shortsScript.scripts[0].error = action.payload as string;
        }
      })

      // Add new shorts script
      .addCase(addNewShortsScript.pending, (state) => {
        state.shortsScript.isAddingNew = true;
        const newScript: IShortsScript = {
          id: `shorts_${Date.now()}`,
          segments: [],
          isLoading: true,
          error: null,
        };
        state.shortsScript.scripts.push(newScript);
      })
      .addCase(addNewShortsScript.fulfilled, (state, action) => {
        state.shortsScript.isAddingNew = false;
        // @ts-ignore
        state.shortsScript.scripts.push(action?.payload || []);
      })
      .addCase(addNewShortsScript.rejected, (state, action) => {
        state.shortsScript.isAddingNew = false;
        const lastScript = state.shortsScript.scripts[state.shortsScript.scripts.length - 1];
        if (lastScript) {
          lastScript.isLoading = false;
          lastScript.error = action.payload as string;
        }
      })

      // Regenerate specific shorts script
      .addCase(regenerateShortsScript.pending, (state, action) => {
        const scriptId = action.meta.arg;
        const script = state.shortsScript.scripts.find((s) => s.id === scriptId);
        if (script) {
          script.isLoading = true;
          script.error = null;
        }
      })
      .addCase(regenerateShortsScript.fulfilled, (state, action) => {
        const { id, segments } = action.payload;
        const script = state.shortsScript.scripts.find((s) => s.id === id);
        if (script) {
          script.isLoading = false;
          if (segments) {
            script.segments = segments;
          }
        }
      })
      .addCase(regenerateShortsScript.rejected, (state, action) => {
        const scriptId = action.meta.arg;
        const script = state.shortsScript.scripts.find((s) => s.id === scriptId);
        if (script) {
          script.isLoading = false;
          script.error = action.payload as string;
        }
      })

      // Generate All
      .addCase(generateAllPackaging.pending, (state) => {
        state.isGeneratingAll = true;
        state.titles.isLoading = true;
        state.titles.error = null;
        state.description.isLoading = true;
        state.description.error = null;
        state.thumbnails.isLoading = true;
        state.thumbnails.error = null;
        state.hooks.isLoading = true;
        state.hooks.error = null;
        const newScript: IShortsScript = {
          id: `shorts_${Date.now()}`,
          segments: [],
          isLoading: true,
          error: null,
        };
        state.shortsScript.scripts = [newScript];
      })
      .addCase(generateAllPackaging.fulfilled, (state, action) => {
        state.isGeneratingAll = false;
        // Update titles
        state.titles.isLoading = false;
        state.titles.titles = action.payload.title.titles || [];
        state.titles.selectedIndex = 0;
        // Update description
        state.description.isLoading = false;
        state.description.content = action.payload.description.description;
        // Update thumbnails
        state.thumbnails.isLoading = false;
        state.thumbnails.descriptions = action.payload.thumbnail.descriptions || [];
        state.thumbnails.selectedIndex = 0;
        // Update hooks
        state.hooks.isLoading = false;
        state.hooks.hooks = action.payload.hooks?.hooks || [];
        // Update shorts
        if (state.shortsScript.scripts.length > 0) {
          state.shortsScript.scripts[0].isLoading = false;
          state.shortsScript.scripts[0].segments = action.payload.shorts.segments;
        }
      })
      .addCase(generateAllPackaging.rejected, (state) => {
        state.isGeneratingAll = false;
        state.titles.isLoading = false;
        state.description.isLoading = false;
        state.thumbnails.isLoading = false;
        state.hooks.isLoading = false;
        if (state.shortsScript.scripts.length > 0) {
          state.shortsScript.scripts[0].isLoading = false;
        }
      })

      // Save Packaging
      .addCase(savePackaging.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(savePackaging.fulfilled, (state, action) => {
        state.isSaving = false;
        state.packagingId = action.payload.packagingId;
        state.savedAt = action.payload.savedAt;
      })
      .addCase(savePackaging.rejected, (state) => {
        state.isSaving = false;
      });
  },
});

export const {
  setScript,
  updateTitleVariation,
  setSelectedTitle,
  updateDescription,
  setSelectedThumbnail,
  updateHook,
  deleteHook,
  deleteShortsScript,
  resetPackaging,
  clearErrors,
} = packagingSlice.actions;

// Selectors
export const selectPackaging = (state: RootState) => state.packaging;
export const selectScript = (state: RootState) => state.packaging.script;
export const selectTitles = (state: RootState) => state.packaging.titles;
export const selectDescription = (state: RootState) => state.packaging.description;
export const selectThumbnails = (state: RootState) => state.packaging.thumbnails;
export const selectHooks = (state: RootState) => state.packaging.hooks;
export const selectShortsScripts = (state: RootState) => state.packaging.shortsScript;
export const selectCanAddMoreShorts = (state: RootState) =>
  state.packaging.shortsScript.scripts.length < MAX_SHORTS_SCRIPTS;
export const selectIsSaving = (state: RootState) => state.packaging.isSaving;
export const selectIsGeneratingAll = (state: RootState) =>
  state.packaging.isGeneratingAll;
export const selectHasContent = (state: RootState) =>
  state.packaging.titles.titles.length > 0 ||
  state.packaging.description.content ||
  state.packaging.thumbnails.descriptions.length > 0 ||
  state.packaging.hooks.hooks.length > 0 ||
  state.packaging.shortsScript.scripts.length > 0;

export default packagingSlice.reducer;
