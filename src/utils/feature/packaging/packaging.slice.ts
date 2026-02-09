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
  title: {
    content: "",
    isLoading: false,
    error: null,
  },
  description: {
    content: "",
    isLoading: false,
    error: null,
  },
  thumbnailDescription: {
    content: "",
    isLoading: false,
    error: null,
  },
  hooks: {
    openingLine: "",
    patternInterrupt: "",
    ctaHook: "",
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
    updateTitle: (state, action: PayloadAction<string>) => {
      state.title.content = action.payload;
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      state.description.content = action.payload;
    },
    updateThumbnailDescription: (state, action: PayloadAction<string>) => {
      state.thumbnailDescription.content = action.payload;
    },
    updateOpeningHook: (state, action: PayloadAction<string>) => {
      state.hooks.openingLine = action.payload;
    },
    updatePatternInterrupt: (state, action: PayloadAction<string>) => {
      state.hooks.patternInterrupt = action.payload;
    },
    updateCtaHook: (state, action: PayloadAction<string>) => {
      state.hooks.ctaHook = action.payload;
    },
    deleteShortsScript: (state, action: PayloadAction<string>) => {
      state.shortsScript.scripts = state.shortsScript.scripts.filter(
        (s) => s.id !== action.payload
      );
    },
    resetPackaging: () => initialState,
    clearErrors: (state) => {
      state.title.error = null;
      state.description.error = null;
      state.thumbnailDescription.error = null;
      state.hooks.error = null;
      state.shortsScript.scripts.forEach((s) => {
        s.error = null;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Title
      .addCase(generateTitle.pending, (state) => {
        state.title.isLoading = true;
        state.title.error = null;
      })
      .addCase(generateTitle.fulfilled, (state, action) => {
        state.title.isLoading = false;
        state.title.content = action.payload.title;
      })
      .addCase(generateTitle.rejected, (state, action) => {
        state.title.isLoading = false;
        state.title.error = action.payload as string;
      })

      // Generate Description
      .addCase(generateDescription.pending, (state) => {
        state.description.isLoading = true;
        state.description.error = null;
      })
      .addCase(generateDescription.fulfilled, (state, action) => {
        state.description.isLoading = false;
        state.description.content = action.payload.description;
      })
      .addCase(generateDescription.rejected, (state, action) => {
        state.description.isLoading = false;
        state.description.error = action.payload as string;
      })

      // Generate Thumbnail
      .addCase(generateThumbnail.pending, (state) => {
        state.thumbnailDescription.isLoading = true;
        state.thumbnailDescription.error = null;
      })
      .addCase(generateThumbnail.fulfilled, (state, action) => {
        state.thumbnailDescription.isLoading = false;
        state.thumbnailDescription.content = action.payload.thumbnailDescription;
      })
      .addCase(generateThumbnail.rejected, (state, action) => {
        state.thumbnailDescription.isLoading = false;
        state.thumbnailDescription.error = action.payload as string;
      })

      // Generate Hooks
      .addCase(generateHooks.pending, (state) => {
        state.hooks.isLoading = true;
        state.hooks.error = null;
      })
      .addCase(generateHooks.fulfilled, (state, action) => {
        state.hooks.isLoading = false;
        state.hooks.openingLine = action.payload.openingLine;
        state.hooks.patternInterrupt = action.payload.patternInterrupt;
        state.hooks.ctaHook = action.payload.ctaHook;
      })
      .addCase(generateHooks.rejected, (state, action) => {
        state.hooks.isLoading = false;
        state.hooks.error = action.payload as string;
      })

      // Generate first Shorts (used in generateAll)
      .addCase(generateShorts.pending, (state) => {
        // Add a new script in loading state
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
          state.shortsScript.scripts[0].segments = action.payload.segments;
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
        const lastScript = state.shortsScript.scripts[state.shortsScript.scripts.length - 1];
        if (lastScript) {
          lastScript.isLoading = false;
          lastScript.segments = action.payload.segments;
        }
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
          script.segments = segments;
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
      })
      .addCase(generateAllPackaging.fulfilled, (state) => {
        state.isGeneratingAll = false;
      })
      .addCase(generateAllPackaging.rejected, (state) => {
        state.isGeneratingAll = false;
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
  updateTitle,
  updateDescription,
  updateThumbnailDescription,
  updateOpeningHook,
  updatePatternInterrupt,
  updateCtaHook,
  deleteShortsScript,
  resetPackaging,
  clearErrors,
} = packagingSlice.actions;

// Selectors
export const selectPackaging = (state: RootState) => state.packaging;
export const selectScript = (state: RootState) => state.packaging.script;
export const selectTitle = (state: RootState) => state.packaging.title;
export const selectDescription = (state: RootState) => state.packaging.description;
export const selectThumbnailDescription = (state: RootState) =>
  state.packaging.thumbnailDescription;
export const selectHooks = (state: RootState) => state.packaging.hooks;
export const selectShortsScripts = (state: RootState) => state.packaging.shortsScript;
export const selectCanAddMoreShorts = (state: RootState) =>
  state.packaging.shortsScript.scripts.length < MAX_SHORTS_SCRIPTS;
export const selectIsSaving = (state: RootState) => state.packaging.isSaving;
export const selectIsGeneratingAll = (state: RootState) =>
  state.packaging.isGeneratingAll;
export const selectHasContent = (state: RootState) =>
  state.packaging.title.content ||
  state.packaging.description.content ||
  state.packaging.thumbnailDescription.content ||
  state.packaging.hooks.openingLine ||
  state.packaging.shortsScript.scripts.length > 0;

export default packagingSlice.reducer;
