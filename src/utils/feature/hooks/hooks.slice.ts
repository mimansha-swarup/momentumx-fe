import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { IHooksBatch, IHooksState } from "@/types/feature/hooks";
import {
  generateHooks,
  selectHook,
  regenerateHooks,
  submitHookFeedback,
  exportHooks,
} from "./hooks.thunk";

const initialState: IHooksState = {
  batch: null,
  selectedHookIndex: null,
  isLoading: false,
  isRegenerating: false,
  isSelecting: false,
  isExporting: false,
  isSubmittingFeedback: false,
  error: null,
};

const hooksSlice = createSlice({
  name: "hooks",
  initialState,
  reducers: {
    clearHooks: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    hydrateSelectedIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedHookIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Hooks
      .addCase(generateHooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateHooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.batch = action.payload ?? null;
        state.selectedHookIndex = null;
      })
      .addCase(generateHooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Select Hook
      .addCase(selectHook.pending, (state) => {
        state.isSelecting = true;
      })
      .addCase(selectHook.fulfilled, (state, action) => {
        state.isSelecting = false;
        if (action.payload) {
          state.selectedHookIndex = action.payload.selectedHookIndex;
        }
      })
      .addCase(selectHook.rejected, (state, action) => {
        state.isSelecting = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Regenerate Hooks
      .addCase(regenerateHooks.pending, (state) => {
        state.isRegenerating = true;
        state.error = null;
      })
      .addCase(regenerateHooks.fulfilled, (state, action) => {
        state.isRegenerating = false;
        if (action.payload) {
          if (state.batch) {
            state.batch.hooks = action.payload.hooks ?? state.batch.hooks;
            state.batch.hookFeedback = {};
          } else if (action.payload.hooks) {
            // Cache-miss revisit: populate batch from regenerate response
            state.batch = action.payload as IHooksBatch;
          }
          state.selectedHookIndex = null;
        }
      })
      .addCase(regenerateHooks.rejected, (state, action) => {
        state.isRegenerating = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Submit Feedback
      .addCase(submitHookFeedback.pending, (state) => {
        state.isSubmittingFeedback = true;
      })
      .addCase(submitHookFeedback.fulfilled, (state, action) => {
        state.isSubmittingFeedback = false;
        if (state.batch && action.payload) {
          state.batch.hookFeedback[String(action.payload.hookIndex)] = action.payload.feedback;
        }
      })
      .addCase(submitHookFeedback.rejected, (state, action) => {
        state.isSubmittingFeedback = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      // Export Hooks
      .addCase(exportHooks.pending, (state) => {
        state.isExporting = true;
      })
      .addCase(exportHooks.fulfilled, (state) => {
        state.isExporting = false;
      })
      .addCase(exportHooks.rejected, (state, action) => {
        state.isExporting = false;
        state.error = (action.payload as string) ?? "Unknown error";
      });
  },
});

export const { clearHooks, clearError, hydrateSelectedIndex } = hooksSlice.actions;

// Selectors
export const selectHooksBatch = (state: RootState) => state.hooks.batch;
export const selectHooksLoading = (state: RootState) => state.hooks.isLoading;
export const selectHooksRegenerating = (state: RootState) =>
  state.hooks.isRegenerating;
export const selectSelectedHookIndex = (state: RootState) =>
  state.hooks.selectedHookIndex;
export const selectHooksError = (state: RootState) => state.hooks.error;
export const selectIsExporting = (state: RootState) => state.hooks.isExporting;
export const selectIsSubmittingFeedback = (state: RootState) =>
  state.hooks.isSubmittingFeedback;
export const selectIsSelecting = (state: RootState) => state.hooks.isSelecting;

export default hooksSlice.reducer;
