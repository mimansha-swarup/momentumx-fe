import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import {
  IPackagingState,
  RegenerateItemResponse,
  GetPackagingResponse,
} from "@/types/feature/packaging";
import {
  generateTitle,
  generateDescription,
  generateThumbnail,
  generateHooks,
  generateShorts,
  regenerateShortsScript,
  generateAllPackaging,
  generateAllPackagingForProject,
  savePackaging,
  listPackaging,
  getPackaging,
  regenerateItem,
  submitPackagingFeedback,
  exportPackaging,
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
    segments: [],
    totalDuration: undefined,
    isLoading: false,
    error: null,
  },
  isSaving: false,
  packagingId: null,
  isGeneratingAll: false,
  packagingList: [],
  isListLoading: false,
  currentPackaging: null,
  isDetailLoading: false,
  itemFeedback: {},
  isRegeneratingItem: false,
  isSubmittingFeedback: false,
  isExporting: false,
  exportText: null,
  error: null,
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
    hydrateFromResponse: (state, action: PayloadAction<GetPackagingResponse>) => {
      const data = action.payload;
      state.packagingId = data.id;
      state.titles.titles = data.titles;
      state.titles.selectedIndex = data.selectedTitleIndex;
      state.titles.isLoading = false;
      state.titles.error = null;
      state.description.content = data.description;
      state.description.isLoading = false;
      state.description.error = null;
      state.thumbnails.descriptions = data.thumbnail;
      state.thumbnails.selectedIndex = data.selectedThumbnailIndex;
      state.thumbnails.isLoading = false;
      state.thumbnails.error = null;
      state.hooks.hooks = data.hooks;
      state.hooks.isLoading = false;
      state.hooks.error = null;
      state.shortsScript.segments = data.shorts?.segments ?? [];
      state.shortsScript.totalDuration = data.shorts?.totalDuration;
      state.shortsScript.isLoading = false;
      state.shortsScript.error = null;
    },
    resetPackaging: () => initialState,
    clearErrors: (state) => {
      state.error = null;
      state.titles.error = null;
      state.description.error = null;
      state.thumbnails.error = null;
      state.hooks.error = null;
      state.shortsScript.error = null;
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
        state.titles.titles = action.payload?.titles || [];
        state.titles.selectedIndex = 0;
      })
      .addCase(generateTitle.rejected, (state, action) => {
        state.titles.isLoading = false;
        state.titles.error = (action.payload as string) ?? "Unknown error";
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
        state.description.error = (action.payload as string) ?? "Unknown error";
      })

      // Generate Thumbnails (3 variations as plain strings)
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
        state.thumbnails.error = (action.payload as string) ?? "Unknown error";
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
        state.hooks.error = (action.payload as string) ?? "Unknown error";
      })

      // Generate Shorts (single)
      .addCase(generateShorts.pending, (state) => {
        state.shortsScript.segments = [];
        state.shortsScript.totalDuration = undefined;
        state.shortsScript.isLoading = true;
        state.shortsScript.error = null;
      })
      .addCase(generateShorts.fulfilled, (state, action) => {
        state.shortsScript.isLoading = false;
        state.shortsScript.segments = action.payload?.segments ?? [];
        state.shortsScript.totalDuration = action.payload?.totalDuration;
      })
      .addCase(generateShorts.rejected, (state, action) => {
        state.shortsScript.isLoading = false;
        state.shortsScript.error = (action.payload as string) ?? "Unknown error";
      })

      // Regenerate single shorts script
      .addCase(regenerateShortsScript.pending, (state) => {
        state.shortsScript.isLoading = true;
        state.shortsScript.error = null;
      })
      .addCase(regenerateShortsScript.fulfilled, (state, action) => {
        state.shortsScript.isLoading = false;
        state.shortsScript.segments = action.payload?.segments ?? [];
        state.shortsScript.totalDuration = action.payload?.totalDuration;
      })
      .addCase(regenerateShortsScript.rejected, (state, action) => {
        state.shortsScript.isLoading = false;
        state.shortsScript.error = (action.payload as string) ?? "Unknown error";
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
        state.shortsScript.segments = [];
        state.shortsScript.totalDuration = undefined;
        state.shortsScript.isLoading = true;
        state.shortsScript.error = null;
      })
      .addCase(generateAllPackaging.fulfilled, (state, action) => {
        state.isGeneratingAll = false;
        // Update titles
        state.titles.isLoading = false;
        state.titles.titles = action.payload.title.titles || [];
        state.titles.selectedIndex = 0;
        // Update description
        state.description.isLoading = false;
        state.description.content =
          action.payload.description.description || "";
        // Update thumbnails (plain strings)
        state.thumbnails.isLoading = false;
        state.thumbnails.descriptions =
          action.payload.thumbnail.descriptions || [];
        state.thumbnails.selectedIndex = 0;
        // Update hooks
        state.hooks.isLoading = false;
        state.hooks.hooks = action.payload.hooks?.hooks || [];
        // Update shorts (single object)
        state.shortsScript.isLoading = false;
        state.shortsScript.segments = action.payload.shorts.segments || [];
        state.shortsScript.totalDuration = action.payload.shorts.totalDuration;
      })
      .addCase(generateAllPackaging.rejected, (state, action) => {
        state.isGeneratingAll = false;
        state.titles.isLoading = false;
        state.description.isLoading = false;
        state.thumbnails.isLoading = false;
        state.hooks.isLoading = false;
        state.shortsScript.isLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Generate All (Pipeline — no hooks)
      .addCase(generateAllPackagingForProject.pending, (state) => {
        state.isGeneratingAll = true;
        state.titles.isLoading = true;
        state.titles.error = null;
        state.description.isLoading = true;
        state.description.error = null;
        state.thumbnails.isLoading = true;
        state.thumbnails.error = null;
        state.shortsScript.segments = [];
        state.shortsScript.totalDuration = undefined;
        state.shortsScript.isLoading = true;
        state.shortsScript.error = null;
      })
      .addCase(generateAllPackagingForProject.fulfilled, (state, action) => {
        state.isGeneratingAll = false;
        state.titles.isLoading = false;
        state.titles.titles = action.payload.title.titles || [];
        state.titles.selectedIndex = 0;
        state.description.isLoading = false;
        state.description.content = action.payload.description.description || "";
        state.thumbnails.isLoading = false;
        state.thumbnails.descriptions = action.payload.thumbnail.descriptions || [];
        state.thumbnails.selectedIndex = 0;
        state.shortsScript.isLoading = false;
        state.shortsScript.segments = action.payload.shorts.segments || [];
        state.shortsScript.totalDuration = action.payload.shorts.totalDuration;
      })
      .addCase(generateAllPackagingForProject.rejected, (state, action) => {
        state.isGeneratingAll = false;
        state.titles.isLoading = false;
        state.description.isLoading = false;
        state.thumbnails.isLoading = false;
        state.shortsScript.isLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Save Packaging
      .addCase(savePackaging.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(savePackaging.fulfilled, (state, action) => {
        state.isSaving = false;
        state.packagingId = action.payload?.id ?? null;
      })
      .addCase(savePackaging.rejected, (state, action) => {
        state.isSaving = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // List Packaging
      .addCase(listPackaging.pending, (state) => {
        state.isListLoading = true;
        state.error = null;
      })
      .addCase(listPackaging.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.packagingList = action.payload ?? [];
      })
      .addCase(listPackaging.rejected, (state, action) => {
        state.isListLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Get Packaging
      .addCase(getPackaging.pending, (state) => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(getPackaging.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.currentPackaging = action.payload ?? null;
      })
      .addCase(getPackaging.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Regenerate Item
      .addCase(regenerateItem.pending, (state) => {
        state.isRegeneratingItem = true;
        state.error = null;
      })
      .addCase(regenerateItem.fulfilled, (state, action) => {
        state.isRegeneratingItem = false;
        const payload: RegenerateItemResponse = action.payload;
        switch (payload.item) {
          case "title": {
            if (payload.data.titles) {
              state.titles.titles = payload.data.titles;
              state.titles.selectedIndex = 0;
            }
            break;
          }
          case "description": {
            if (payload.data.description !== undefined) {
              state.description.content = payload.data.description;
            }
            break;
          }
          case "thumbnail": {
            if (payload.data.descriptions) {
              state.thumbnails.descriptions = payload.data.descriptions;
              state.thumbnails.selectedIndex = 0;
            }
            break;
          }
          case "shorts": {
            if (payload.data.segments) {
              state.shortsScript.segments = payload.data.segments;
            }
            if (payload.data.totalDuration) {
              state.shortsScript.totalDuration = payload.data.totalDuration;
            }
            break;
          }
        }
      })
      .addCase(regenerateItem.rejected, (state, action) => {
        state.isRegeneratingItem = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Submit Packaging Feedback
      .addCase(submitPackagingFeedback.pending, (state) => {
        state.isSubmittingFeedback = true;
        state.error = null;
      })
      .addCase(submitPackagingFeedback.fulfilled, (state, action) => {
        state.isSubmittingFeedback = false;
        if (action.payload) {
          state.itemFeedback[action.payload.item] = action.payload.feedback;
        }
      })
      .addCase(submitPackagingFeedback.rejected, (state, action) => {
        state.isSubmittingFeedback = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Export Packaging
      .addCase(exportPackaging.pending, (state) => {
        state.isExporting = true;
        state.exportText = null;
        state.error = null;
      })
      .addCase(exportPackaging.fulfilled, (state, action) => {
        state.isExporting = false;
        state.exportText = action.payload?.text ?? null;
      })
      .addCase(exportPackaging.rejected, (state, action) => {
        state.isExporting = false;
        state.error = (action.payload as string) ?? "Unknown error";
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
  hydrateFromResponse,
  resetPackaging,
  clearErrors,
} = packagingSlice.actions;

// Selectors
export const selectPackaging = (state: RootState) => state.packaging;
export const selectScript = (state: RootState) => state.packaging.script;
export const selectTitles = (state: RootState) => state.packaging.titles;
export const selectDescription = (state: RootState) =>
  state.packaging.description;
export const selectThumbnails = (state: RootState) =>
  state.packaging.thumbnails;
export const selectHooks = (state: RootState) => state.packaging.hooks;
export const selectShortsScripts = (state: RootState) =>
  state.packaging.shortsScript;
export const selectIsSaving = (state: RootState) => state.packaging.isSaving;
export const selectIsGeneratingAll = (state: RootState) =>
  state.packaging.isGeneratingAll;
export const selectPackagingList = (state: RootState) =>
  state.packaging.packagingList;
export const selectIsListLoading = (state: RootState) =>
  state.packaging.isListLoading;
export const selectCurrentPackaging = (state: RootState) =>
  state.packaging.currentPackaging;
export const selectIsDetailLoading = (state: RootState) =>
  state.packaging.isDetailLoading;
export const selectIsRegeneratingItem = (state: RootState) =>
  state.packaging.isRegeneratingItem;
export const selectIsSubmittingFeedback = (state: RootState) =>
  state.packaging.isSubmittingFeedback;
export const selectIsExporting = (state: RootState) =>
  state.packaging.isExporting;
export const selectExportText = (state: RootState) =>
  state.packaging.exportText;
export const selectPackagingError = (state: RootState) =>
  state.packaging.error;
export const selectItemFeedback = (state: RootState) => state.packaging.itemFeedback;
export const selectHasContent = (state: RootState) =>
  state.packaging.titles.titles.length > 0 ||
  !!state.packaging.description.content ||
  state.packaging.thumbnails.descriptions.length > 0 ||
  state.packaging.hooks.hooks.length > 0 ||
  state.packaging.shortsScript.segments.length > 0;

export default packagingSlice.reducer;
