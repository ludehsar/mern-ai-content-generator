import type { LoginDto } from "@/types/auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginUser(state, _action: PayloadAction<LoginDto>) {
      state.status = "pending";
    },
    loginUserSuccess(state, action) {
      state.user = action.payload;
      state.error = null;
      state.status = "complete";
    },
    loginUserFailure(state, action) {
      state.user = null;
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

export const { loginUser, loginUserSuccess, loginUserFailure } =
  authSlice.actions;

export default authSlice.reducer;
