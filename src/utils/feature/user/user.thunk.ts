import { onboardingService } from "@/service/onboarding";
import { IOnboardingPayload } from "@/types/components/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export const getUser = createAsyncThunk<
  IUserProfile | undefined,
  void,
  { rejectValue: string }
>("user/getUser", async (_, thunkAPI) => {
  try {
    const response = await onboardingService.getUserRecord();
    return response.data as IUserProfile | undefined;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk<
  IUserProfile | undefined,
  IOnboardingPayload,
  { rejectValue: string }
>("user/updateProfile", async (payload, thunkAPI) => {
  try {
    const response = await onboardingService.updateProfile(payload);
    handleToast({
      message: response.message ?? "",
      warning: response.warning ?? "",
    });
    return response.data as IUserProfile | undefined;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
