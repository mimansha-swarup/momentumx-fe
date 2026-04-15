import { onboardingService } from "@/service/onboarding";
import { IOnboardingPayload } from "@/types/components/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const response = await onboardingService.getUserRecord();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk<
  IUserProfile | undefined,
  IOnboardingPayload,
  { rejectValue: string }
>(
  "user/updateProfile",
  async (payload, thunkAPI) => {
    try {
      const response = await onboardingService.updateProfile(payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);
