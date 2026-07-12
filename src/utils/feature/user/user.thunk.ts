import { onboardingService } from "@/service/onboarding";
import {
  IUserProfile,
  IProfileInput,
  IPrefillResponse,
} from "@/types/feature/user";
import { auth } from "@/utils/firebase/config";
import { handleToast } from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/utils/error";

export const getUser = createAsyncThunk<
  IUserProfile | undefined,
  void,
  { rejectValue: string }
>("user/getUser", async (_, thunkAPI) => {
  try {
    const response = await onboardingService.getUserRecord();
    if (response.data?.uid) return response.data;
    // Doc not created yet (new-user auth-trigger race) — return a minimal
    // identity so the gate routes to onboarding instead of bouncing to /login.
    const fb = auth.currentUser;
    return fb
      ? {
          uid: fb.uid,
          email: fb.email ?? "",
          name: fb.displayName ?? "",
          photoURL: fb.photoURL ?? "",
        }
      : undefined;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// Infer suggestions from a channel URL (not persisted) — powers the value-first
// onboarding "aha" before the user commits any fields.
export const prefillFromChannel = createAsyncThunk<
  IPrefillResponse | undefined,
  string,
  { rejectValue: string }
>("user/prefill", async (channelUrl, thunkAPI) => {
  try {
    const response = await onboardingService.prefill(channelUrl);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const completeOnboarding = createAsyncThunk<
  void,
  IProfileInput,
  { rejectValue: string }
>("user/completeOnboarding", async (payload, thunkAPI) => {
  try {
    const response = await onboardingService.completeOnboarding(payload);
    handleToast({
      message: response.message ?? "",
      warning: response.warning ?? "",
    });
    // Refetch the canonical profile (fresh completeness + enriched fields).
    await thunkAPI.dispatch(getUser());
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk<
  void,
  IProfileInput,
  { rejectValue: string }
>("user/updateProfile", async (payload, thunkAPI) => {
  try {
    const response = await onboardingService.updateProfile(payload);
    handleToast({
      message: response.message ?? "",
      warning: response.warning ?? "",
    });
    await thunkAPI.dispatch(getUser());
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const refreshContext = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("user/refreshContext", async (_, thunkAPI) => {
  try {
    const response = await onboardingService.refreshContext();
    handleToast({
      message: response.message ?? "",
      warning: response.warning ?? "",
    });
    await thunkAPI.dispatch(getUser());
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
