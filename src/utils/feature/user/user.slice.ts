import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import {
  getUser,
  prefillFromChannel,
  completeOnboarding,
  updateProfile,
  refreshContext,
} from "./user.thunk";
import { IUserInitialState, IUserProfile } from "@/types/feature/user";

const initialState: IUserInitialState = {
  data: null,
  isLoading: true,
  isUpdating: false,
  isPrefilling: false,
  isRefreshing: false,
  prefill: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserProfile | null>) => {
      state.data = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload ?? null;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load profile";
      })

      // Prefill (value-first onboarding)
      .addCase(prefillFromChannel.pending, (state) => {
        state.isPrefilling = true;
        state.error = null;
      })
      .addCase(prefillFromChannel.fulfilled, (state, action) => {
        state.isPrefilling = false;
        state.prefill = action.payload ?? null;
      })
      .addCase(prefillFromChannel.rejected, (state, action) => {
        state.isPrefilling = false;
        state.error = action.payload ?? "Couldn't read that channel";
      })

      // Complete onboarding (getUser refetch inside the thunk updates data).
      // `prefill` is intentionally kept — the enrich nudge pre-fills niche/audience
      // from those inferred suggestions after a URL-only first-run.
      .addCase(completeOnboarding.pending, (state) => {
        state.error = null;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to save onboarding";
      })

      // Profile edit (settings)
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload ?? "Failed to update profile";
      })

      // Refresh context
      .addCase(refreshContext.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshContext.fulfilled, (state) => {
        state.isRefreshing = false;
      })
      .addCase(refreshContext.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload ?? "Failed to refresh context";
      });
  },
});

export const { setUser } = userSlice.actions;

export const currentUser = (state: RootState) => state.user.data;
export const userLoading = (state: RootState) => state.user.isLoading;
export const selectIsUpdating = (state: RootState) => state.user.isUpdating;
export const selectIsPrefilling = (state: RootState) => state.user.isPrefilling;
export const selectIsRefreshing = (state: RootState) => state.user.isRefreshing;
export const selectPrefill = (state: RootState) => state.user.prefill;
export const selectUserError = (state: RootState) => state.user.error;
export const selectCompleteness = (state: RootState) =>
  state.user.data?.completeness ?? null;

// Soft gate: the backend's required minimum is a channel URL, OR both niche and
// target audience. A user below that is routed through onboarding.
export const selectIsOnboarded = (state: RootState): boolean => {
  const u = state.user.data;
  if (!u) return false;
  return Boolean(u.userName || (u.niche && u.targetAudience));
};

export default userSlice.reducer;
