import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { editTitles, generateTitles, retrieveTitles } from "./titles.thunk";
import { ITitleState, TitleFilters } from "@/types/feature/title";

const initialState: ITitleState = {
  data: null,
  params: {
    filter: TitleFilters.ALL,
    searchText: "",
  },
  isLoading: false,
  isDone: false,
};
const titlesSlice = createSlice({
  name: "titles",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isDone = false;
      state.isLoading = true;
    },
    addTitle: (state, action) => {
      state.data = {
        ...state.data,
        meta: {
          ...action.payload?.meta,
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

    updateFilter: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },
    markScriptGenerated: (state, action) => {
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
      })
      .addCase(retrieveTitles.fulfilled, (state, action) => {
        const { isFresh, data } = action.payload ?? {};
        if (isFresh) {
          state.data = data;
        } else {
          const { lists = [], meta } = data ?? {};
          state.data = {
            ...state.data,
            meta: {
              ...state.data?.meta,
              ...meta,
            },
            lists: [...(state.data?.lists ?? []), ...lists],
          };
        }
        state.isLoading = false;
      })
      .addCase(retrieveTitles.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(generateTitles.pending, (state) => {
        state.isDone = true;
      })
      .addCase(generateTitles.fulfilled, (state, action) => {
        state.isDone = false;
        state.data = {
          ...state.data,
          meta: {
            nextCursor: {
              createdAt: state.data?.meta?.nextCursor?.createdAt ?? "",
              docId: state.data?.meta?.nextCursor?.docId ?? "",
            },
            hasNextPage: state.data?.meta?.hasNextPage ?? false,
          },
          lists: [
            ...(action.payload?.data ?? []),
            ...(state.data?.lists ?? []),
          ],
        };
      })
      .addCase(generateTitles.rejected, (state) => {
        state.isDone = false;
      })

      .addCase(editTitles.fulfilled, (state, action) => {
        if (!state.data?.lists) return;
        state.data = {
          ...state.data,
          lists: state.data.lists.map((title) =>
            title.id === action.payload.id ? action.payload : title
          ),
        };
      })
  },
});

export const {
  resetState,
  addTitle,
  markDone,
  resetTitle,
  updateFilter,
  markScriptGenerated,
} = titlesSlice.actions;

export const rootTitle = (state: RootState) => state.titles;
export const getTitlesData = (state: RootState) => state.titles.data;
export const titlesLoading = (state: RootState) => state.titles.isLoading;
export const titlesDone = (state: RootState) => state.titles.isDone;

export default titlesSlice.reducer;
