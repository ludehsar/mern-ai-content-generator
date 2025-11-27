import { takeLatest, put, call } from "redux-saga/effects";
import {
  loginUser,
  loginUserSuccess,
  loginUserFailure,
} from "../slices/authSlice";
import type { User } from "@/types/auth";
import { loginUser as loginUserApi } from "@/api/auth";

function* handleLogin(action: ReturnType<typeof loginUser>) {
  try {
    const user = (yield call(loginUserApi, action.payload)) as User;
    yield put(loginUserSuccess(user));
  } catch (error) {
    yield put(loginUserFailure(error as Error));
  }
}

function* authSaga() {
  yield takeLatest(loginUser.type, handleLogin);
}

export default authSaga;
