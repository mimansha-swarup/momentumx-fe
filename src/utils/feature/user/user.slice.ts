import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { getUser } from "./user.thunk";
import { IUserInitialState } from "@/types/feature/user";

const initialState: IUserInitialState = {
  data: null,
  isLoading: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, setLoading } = userSlice.actions;

export const currentUser = (state: RootState) => state.user.data;
export const userLoading = (state: RootState) => state.user.isLoading;

export default userSlice.reducer;
