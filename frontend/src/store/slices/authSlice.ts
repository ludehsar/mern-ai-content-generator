import type { LoginDto, RegisterDto, User } from "@/types/auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null as User | null,
  error: null as Error | null,
  status: "idle" as "idle" | "pending" | "complete" | "failed",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginUser(state, _action: PayloadAction<LoginDto>) {
      state.status = "pending";
      state.error = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerUser(state, _action: PayloadAction<RegisterDto>) {
      state.status = "pending";
      state.error = null;
    },
    getUser(state) {
      state.status = "pending";
      state.error = null;
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

export const { loginUser, registerUser, loginUserSuccess, loginUserFailure } =
  authSlice.actions;

export default authSlice.reducer;
