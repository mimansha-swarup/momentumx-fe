import { onboardingService } from "@/service/onboarding";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const response = await new onboardingService().getUserRecord();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
