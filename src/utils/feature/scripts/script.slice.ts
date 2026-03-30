import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RootState } from "@/utils/store";
import {
  editScript,
  exportScript,
  regenerateScript,
  retrieveScripts,
  submitScriptFeedback,
} from "./script.thunk";
import { IGeneratedScript, IScriptState } from "@/types/feature/script";

const initialState: IScriptState = {
  data: null,
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
      state.isLoading = true;
    },
    addScript: (state, action: PayloadAction<IGeneratedScript>) => {
      state.data = [action.payload, ...(state.data ?? [])];
    },

    markDone: (state) => {
      state.isDone = true;
      state.isLoading = false;
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
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })
      .addCase(editScript.pending, (state) => {
        state.isEditing = true;
        state.error = null;
      })
      .addCase(editScript.fulfilled, (state, action) => {
        state.isEditing = false;
        const payload = action.payload;
        if (state.data && payload) {
          state.data = state.data.map((script) => {
            if (script.id === payload.id) {
              return { ...script, ...payload };
            }
            return script;
          });
        }
      })
      .addCase(editScript.rejected, (state, action) => {
        state.isEditing = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })

      // Submit Feedback
      .addCase(submitScriptFeedback.pending, (state) => {
        state.isSubmittingFeedback = true;
        state.error = null;
      })
      .addCase(submitScriptFeedback.fulfilled, (state, action) => {
        state.isSubmittingFeedback = false;
        const payload = action.payload;
        if (state.data && payload) {
          const script = state.data.find((s) => s.id === payload.id);
          if (script) {
            script.userFeedback = payload.userFeedback;
          }
        }
      })
      .addCase(submitScriptFeedback.rejected, (state, action) => {
        state.isSubmittingFeedback = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
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
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })

      // Regenerate Script
      .addCase(regenerateScript.pending, (state) => {
        state.isRegenerating = true;
        state.error = null;
      })
      .addCase(regenerateScript.fulfilled, (state, action) => {
        state.isRegenerating = false;
        const payload = action.payload;
        if (state.data && payload) {
          state.data = state.data.map((script) => {
            if (script.id === payload.id) {
              return {
                ...script,
                title: payload.title,
                script: payload.script,
              };
            }
            return script;
          });
        }
      })
      .addCase(regenerateScript.rejected, (state, action) => {
        state.isRegenerating = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      });
  },
});

export const { resetState, addScript, markDone } = scriptsSlice.actions;

export const rootScripts = (state: RootState) => state.scripts;
export const getScriptsData = (state: RootState) => state.scripts.data;
export const scriptsLoading = (state: RootState) => state.scripts.isLoading;
export const scriptsDone = (state: RootState) => state.scripts.isDone;
export const scriptsError = (state: RootState) => state.scripts.error;
export const scriptsIsSubmittingFeedback = (state: RootState) =>
  state.scripts.isSubmittingFeedback;
export const scriptsIsExporting = (state: RootState) => state.scripts.isExporting;
export const scriptsExportResult = (state: RootState) => state.scripts.exportResult;
export const scriptsIsRegenerating = (state: RootState) => state.scripts.isRegenerating;
export const scriptsIsEditing = (state: RootState) => state.scripts.isEditing;

export default scriptsSlice.reducer;
