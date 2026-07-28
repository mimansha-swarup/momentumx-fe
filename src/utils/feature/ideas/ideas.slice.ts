import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import {
  editIdeas,
  exportIdeas,
  generateIdeas,
  regenerateAllIdeas,
  regenerateOneIdea,
  retrieveIdeas,
} from "./ideas.thunk";
import { IGeneratedIdea } from "@/types/components/dashboard";
import { IIdeaParams, IIdeaState, IdeaFilters } from "@/types/feature/idea";

const initialState: IIdeaState = {
  data: null,
  params: {
    filter: IdeaFilters.ALL,
    searchText: "",
  },
  isLoading: false,
  isDone: false,
  isEditing: false,
  isRegenerating: false,
  isExporting: false,
  exportText: null,
  error: null,
};
const ideasSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isDone = false;
    },
    resetTitle: (state) => {
      state.data = null;
    },

    markDone: (state) => {
      state.isDone = true;
      state.isLoading = false;
    },

    updateFilter: (state, action: PayloadAction<Partial<IIdeaParams>>) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },
    clearExportText: (state) => {
      state.exportText = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder

      .addCase(retrieveIdeas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(retrieveIdeas.fulfilled, (state, action) => {
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
      .addCase(retrieveIdeas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })
      .addCase(generateIdeas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateIdeas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = {
          ...state.data,
          // Preserve the pagination cursor — generating prepends new ideas at the
          // top and doesn't invalidate the boundary for loading OLDER ones.
          // (Nulling nextCursor while keeping hasNextPage left a dead "Load More".)
          meta: state.data?.meta ?? { nextCursor: null, hasNextPage: false },
          lists: [
            ...(action.payload?.data ?? []),
            ...(state.data?.lists ?? []),
          ],
        };
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.isLoading = false;
        state.isDone = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      .addCase(editIdeas.pending, (state) => {
        state.isEditing = true;
        state.error = null;
      })
      .addCase(editIdeas.fulfilled, (state, action) => {
        state.isEditing = false;
        if (!state.data?.lists) return;
        state.data = {
          ...state.data,
          lists: state.data.lists.map((title) =>
            title.id === action.payload?.id ? { ...title, ...action.payload } : title
          ),
        };
      })
      .addCase(editIdeas.rejected, (state, action) => {
        state.isEditing = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      .addCase(regenerateAllIdeas.pending, (state) => {
        state.isRegenerating = true;
        state.error = null;
      })
      .addCase(regenerateAllIdeas.fulfilled, (state) => {
        state.isRegenerating = false;
        // The new batch will be fetched via retrieveIdeas after regeneration.
        // Clear existing list so the next fetch replaces rather than appends.
        state.data = null;
      })
      .addCase(regenerateAllIdeas.rejected, (state, action) => {
        state.isRegenerating = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      .addCase(regenerateOneIdea.pending, (state) => {
        state.isRegenerating = true;
        state.error = null;
      })
      .addCase(regenerateOneIdea.fulfilled, (state, action) => {
        state.isRegenerating = false;
        if (!state.data?.lists || !action.payload) return;
        state.data = {
          ...state.data,
          lists: state.data.lists.map((idea) =>
            idea.id === action.payload!.id ? { ...idea, ...action.payload } : idea
          ),
        };
      })
      .addCase(regenerateOneIdea.rejected, (state, action) => {
        state.isRegenerating = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })

      .addCase(exportIdeas.pending, (state) => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportIdeas.fulfilled, (state, action) => {
        state.isExporting = false;
        state.exportText = action.payload?.text ?? null;
      })
      .addCase(exportIdeas.rejected, (state, action) => {
        state.isExporting = false;
        state.error = (action.payload as string) ?? "Unknown error";
      })
  },
});

export const {
  resetState,
  markDone,
  resetTitle,
  updateFilter,
  clearExportText,
} = ideasSlice.actions;

export const selectIdeasData = (state: RootState) => state.ideas.data;
export const selectIdeasLoading = (state: RootState) => state.ideas.isLoading;
export const selectIdeasDone = (state: RootState) => state.ideas.isDone;
export const selectIdeasIsEditing = (state: RootState) => state.ideas.isEditing;
export const selectIdeasIsRegenerating = (state: RootState) => state.ideas.isRegenerating;
export const selectIdeasIsExporting = (state: RootState) => state.ideas.isExporting;
export const selectIdeasExportText = (state: RootState) => state.ideas.exportText;
export const selectIdeasError = (state: RootState) => state.ideas.error;

// Memoized: a plain `.filter()` selector returns a new array every call and
// would re-render its consumer on every dispatch app-wide.
export const selectActiveIdeas = createSelector(
  selectIdeasData,
  (data): IGeneratedIdea[] =>
    data?.lists.filter((t) => !t.archived) ?? []
);

export const selectHasLinkedProjects = (state: RootState): boolean =>
  (state.ideas.data?.lists ?? []).some((t) => !t.archived && t.videoProjectId !== null);

export const selectIdeasCursor = (state: RootState) =>
  state.ideas.data?.meta ?? null;

export default ideasSlice.reducer;
