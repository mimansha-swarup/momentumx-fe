import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RootState } from "@/utils/store";
import {
  editTitles,
  exportTopics,
  generateTitles,
  regenerateAllTopics,
  regenerateOneTopic,
  retrieveTitles,
  submitTopicFeedback,
} from "./titles.thunk";
import { IGeneratedTopic } from "@/types/components/dashboard";
import { ITitleData, ITitleParams, ITitleState, TitleFilters } from "@/types/feature/title";

const initialState: ITitleState = {
  data: null,
  params: {
    filter: TitleFilters.ALL,
    searchText: "",
  },
  isLoading: false,
  isDone: false,
  isEditing: false,
  isRegenerating: false,
  isExporting: false,
  isSubmittingFeedback: false,
  exportText: null,
  error: null,
};
const titlesSlice = createSlice({
  name: "titles",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isDone = false;
      state.isLoading = true;
    },
    addTitle: (state, action: PayloadAction<{ meta?: ITitleData['meta']; list?: IGeneratedTopic[] }>) => {
      state.data = {
        ...state.data,
        meta: {
          nextCursor: action.payload?.meta?.nextCursor ?? null,
          hasNextPage: action.payload?.meta?.hasNextPage ?? false,
        },
        lists: [
          ...(state?.data?.lists ?? []),
          ...(action?.payload?.list ?? []),
        ],
      };
    },
    resetTitle: (state) => {
      state.data = null;
    },

    markDone: (state) => {
      state.isDone = true;
      state.isLoading = false;
    },

    updateFilter: (state, action: PayloadAction<Partial<ITitleParams>>) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },
    clearExportText: (state) => {
      state.exportText = null;
    },
    markScriptGenerated: (state, action: PayloadAction<string>) => {
      if (state.data?.lists) {
        state.data.lists = state.data?.lists?.map((title) =>
          title.id === action.payload
            ? { ...title, isScriptGenerated: true }
            : title
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder

      .addCase(retrieveTitles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(retrieveTitles.fulfilled, (state, action) => {
        const { isFresh, data } = action.payload ?? {};
        if (isFresh) {
          state.data = data ?? null;
        } else {
          const { lists = [], meta } = data ?? {};
          state.data = {
            ...state.data,
            meta: {
              nextCursor: meta?.nextCursor ?? state.data?.meta?.nextCursor ?? null,
              hasNextPage: meta?.hasNextPage ?? state.data?.meta?.hasNextPage ?? false,
            },
            lists: [...(state.data?.lists ?? []), ...lists],
          };
        }
        state.isLoading = false;
      })
      .addCase(retrieveTitles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })
      .addCase(generateTitles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateTitles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDone = false;
        state.data = {
          ...state.data,
          meta: {
            nextCursor: null,
            hasNextPage: state.data?.meta?.hasNextPage ?? false,
          },
          lists: [
            ...(action.payload?.data ?? []),
            ...(state.data?.lists ?? []),
          ],
        };
      })
      .addCase(generateTitles.rejected, (state, action) => {
        state.isLoading = false;
        state.isDone = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })

      .addCase(editTitles.pending, (state) => {
        state.isEditing = true;
        state.error = null;
      })
      .addCase(editTitles.fulfilled, (state, action) => {
        state.isEditing = false;
        if (!state.data?.lists) return;
        state.data = {
          ...state.data,
          lists: state.data.lists.map((title) =>
            title.id === action.payload?.id ? { ...title, ...action.payload } : title
          ),
        };
      })
      .addCase(editTitles.rejected, (state, action) => {
        state.isEditing = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })

      .addCase(regenerateAllTopics.pending, (state) => {
        state.isRegenerating = true;
        state.error = null;
      })
      .addCase(regenerateAllTopics.fulfilled, (state) => {
        state.isRegenerating = false;
        // The new batch will be fetched via retrieveTitles after regeneration.
        // Clear existing list so the next fetch replaces rather than appends.
        state.data = null;
      })
      .addCase(regenerateAllTopics.rejected, (state, action) => {
        state.isRegenerating = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })

      .addCase(regenerateOneTopic.pending, (state) => {
        state.isRegenerating = true;
        state.error = null;
      })
      .addCase(regenerateOneTopic.fulfilled, (state, action) => {
        state.isRegenerating = false;
        if (!state.data?.lists || !action.payload) return;
        state.data = {
          ...state.data,
          lists: state.data.lists.map((topic) =>
            topic.id === action.payload!.id ? { ...topic, ...action.payload } : topic
          ),
        };
      })
      .addCase(regenerateOneTopic.rejected, (state, action) => {
        state.isRegenerating = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })

      .addCase(submitTopicFeedback.pending, (state) => {
        state.isSubmittingFeedback = true;
        state.error = null;
      })
      .addCase(submitTopicFeedback.fulfilled, (state, action) => {
        state.isSubmittingFeedback = false;
        if (state.data?.lists && action.payload) {
          const topic = state.data.lists.find((t) => t.id === action.payload!.id);
          if (topic) {
            topic.userFeedback = action.payload.userFeedback;
          }
        }
      })
      .addCase(submitTopicFeedback.rejected, (state, action) => {
        state.isSubmittingFeedback = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })

      .addCase(exportTopics.pending, (state) => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportTopics.fulfilled, (state, action) => {
        state.isExporting = false;
        state.exportText = action.payload?.text ?? null;
      })
      .addCase(exportTopics.rejected, (state, action) => {
        state.isExporting = false;
        state.error = (action.payload as AxiosError)?.message ?? "Unknown error";
      })
  },
});

export const {
  resetState,
  addTitle,
  markDone,
  resetTitle,
  updateFilter,
  clearExportText,
  markScriptGenerated,
} = titlesSlice.actions;

export const selectTitlesRoot = (state: RootState) => state.titles;
export const selectTitlesData = (state: RootState) => state.titles.data;
export const selectTitlesLoading = (state: RootState) => state.titles.isLoading;
export const selectTitlesDone = (state: RootState) => state.titles.isDone;
export const selectTitlesIsEditing = (state: RootState) => state.titles.isEditing;
export const selectTitlesIsRegenerating = (state: RootState) => state.titles.isRegenerating;
export const selectTitlesIsExporting = (state: RootState) => state.titles.isExporting;
export const selectTitlesIsSubmittingFeedback = (state: RootState) => state.titles.isSubmittingFeedback;
export const selectTitlesExportText = (state: RootState) => state.titles.exportText;
export const selectTitlesError = (state: RootState) => state.titles.error;

export const selectActiveTopics = (state: RootState): IGeneratedTopic[] =>
  state.titles.data?.lists.filter((t) => !t.archived) ?? [];

export const selectHasLinkedProjects = (state: RootState): boolean =>
  (state.titles.data?.lists ?? []).some((t) => !t.archived && t.videoProjectId !== null);

export const selectTopicsCursor = (state: RootState) =>
  state.titles.data?.meta ?? null;

export default titlesSlice.reducer;
