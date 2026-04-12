import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import {
  editScript,
  exportScript,
  getScriptById,
  regenerateScript,
  retrieveScripts,
  submitScriptFeedback,
} from "./script.thunk";
import { IGeneratedScript, IScriptState } from "@/types/feature/script";

const initialState: IScriptState = {
  data: null,
  currentScript: null,
  isLoadingCurrent: false,
  isLoading: false,
  isDone: false,
  error: null,
  isSubmittingFeedback: false,
  isExporting: false,
  exportResult: null,
  isRegenerating: false,
  isEditing: false,
};
const scriptsSlice = createSlice({
  name: "scripts",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isDone = false;
      state.error = null;
    },
    addScript: (state, action: PayloadAction<IGeneratedScript>) => {
      state.data = [action.payload, ...(state.data ?? [])];
    },

    markDone: (state) => {
      state.isDone = true;
      state.isLoading = false;
    },
    clearCurrentScript: (state) => {
      state.currentScript = null;
      state.isLoadingCurrent = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveScripts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(retrieveScripts.fulfilled, (state, action) => {
        state.data = action.payload ?? null;
        state.isLoading = false;
      })
      .addCase(retrieveScripts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // Get Script By ID
      .addCase(getScriptById.pending, (state) => {
        state.isLoadingCurrent = true;
        state.error = null;
      })
      .addCase(getScriptById.fulfilled, (state, action) => {
        state.isLoadingCurrent = false;
        state.currentScript = action.payload ?? null;
      })
      .addCase(getScriptById.rejected, (state, action) => {
        state.isLoadingCurrent = false;
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(editScript.pending, (state) => {
        state.isEditing = true;
        state.error = null;
      })
      .addCase(editScript.fulfilled, (state, action) => {
        state.isEditing = false;
        const payload = action.payload;
        if (payload) {
          if (state.data) {
            state.data = state.data.map((script) =>
              script.id === payload.id ? { ...script, ...payload } : script
            );
          }
          if (state.currentScript?.id === payload.id) {
            state.currentScript = { ...state.currentScript, ...payload };
          }
        }
      })
      .addCase(editScript.rejected, (state, action) => {
        state.isEditing = false;
        state.error = action.payload ?? "Unknown error";
      })

      // Submit Feedback
      .addCase(submitScriptFeedback.pending, (state) => {
        state.isSubmittingFeedback = true;
        state.error = null;
      })
      .addCase(submitScriptFeedback.fulfilled, (state, action) => {
        state.isSubmittingFeedback = false;
        const payload = action.payload;
        if (payload) {
          if (state.data) {
            const script = state.data.find((s) => s.id === payload.id);
            if (script) {
              script.userFeedback = payload.userFeedback;
            }
          }
          if (state.currentScript?.id === payload.id) {
            state.currentScript.userFeedback = payload.userFeedback;
          }
        }
      })
      .addCase(submitScriptFeedback.rejected, (state, action) => {
        state.isSubmittingFeedback = false;
        state.error = action.payload ?? "Unknown error";
      })

      // Export Script
      .addCase(exportScript.pending, (state) => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportScript.fulfilled, (state, action) => {
        state.isExporting = false;
        state.exportResult = action.payload ?? null;
      })
      .addCase(exportScript.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload ?? "Unknown error";
      })

      // Regenerate Script
      .addCase(regenerateScript.pending, (state) => {
        state.isRegenerating = true;
        state.error = null;
      })
      .addCase(regenerateScript.fulfilled, (state, action) => {
        state.isRegenerating = false;
        const payload = action.payload;
        if (payload) {
          if (state.data) {
            state.data = state.data.map((script) =>
              script.id === payload.id
                ? { ...script, title: payload.title, script: payload.script }
                : script
            );
          }
          if (state.currentScript?.id === payload.id) {
            state.currentScript = {
              ...state.currentScript,
              title: payload.title,
              script: payload.script,
            };
          }
        }
      })
      .addCase(regenerateScript.rejected, (state, action) => {
        state.isRegenerating = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { resetState, addScript, markDone, clearCurrentScript, clearError } =
  scriptsSlice.actions;

// Selectors — consistent select* naming
export const selectScripts = (state: RootState) => state.scripts;
export const selectScriptsData = (state: RootState) => state.scripts.data;
export const selectScriptsLoading = (state: RootState) => state.scripts.isLoading;
export const selectScriptsDone = (state: RootState) => state.scripts.isDone;
export const selectScriptsError = (state: RootState) => state.scripts.error;
export const selectScriptsIsSubmittingFeedback = (state: RootState) =>
  state.scripts.isSubmittingFeedback;
export const selectScriptsIsExporting = (state: RootState) => state.scripts.isExporting;
export const selectScriptsExportResult = (state: RootState) => state.scripts.exportResult;
export const selectScriptsIsRegenerating = (state: RootState) => state.scripts.isRegenerating;
export const selectScriptsIsEditing = (state: RootState) => state.scripts.isEditing;
export const selectCurrentScript = (state: RootState) => state.scripts.currentScript;
export const selectIsLoadingCurrentScript = (state: RootState) =>
  state.scripts.isLoadingCurrent;

export default scriptsSlice.reducer;
