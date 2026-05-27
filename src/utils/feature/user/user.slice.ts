import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { getUser, updateProfile } from "./user.thunk";
import { IUserInitialState, IUserProfile } from "@/types/feature/user";

const initialState: IUserInitialState = {
  data: null,
  isLoading: true,
  isUpdating: false,
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
        state.error = (action.payload as string) ?? "Failed to load profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload) {
          state.data = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload ?? "Failed to update profile";
      });
  },
});

export const { setUser } = userSlice.actions;

export const currentUser = (state: RootState) => state.user.data;
export const userLoading = (state: RootState) => state.user.isLoading;
export const selectIsUpdating = (state: RootState) => state.user.isUpdating;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
