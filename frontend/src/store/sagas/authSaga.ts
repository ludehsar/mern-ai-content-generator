import { takeLatest, put, call } from "redux-saga/effects";
import {
  loginUser,
  registerUser,
  loginUserSuccess,
  loginUserFailure,
} from "../slices/authSlice";
import type { User } from "@/types/auth";
import {
  loginUser as loginUserApi,
  registerUser as registerUserApi,
} from "@/api/auth";

function* handleLogin(action: ReturnType<typeof loginUser>) {
  try {
    const user = (yield call(loginUserApi, action.payload)) as User;
    yield put(loginUserSuccess(user));
  } catch (error) {
    yield put(loginUserFailure(error as Error));
  }
}

function* handleRegister(action: ReturnType<typeof registerUser>) {
  try {
    const user = (yield call(registerUserApi, action.payload)) as User;
    yield put(loginUserSuccess(user));
  } catch (error) {
    yield put(loginUserFailure(error as Error));
  }
}

function* authSaga() {
  yield takeLatest(loginUser.type, handleLogin);
  yield takeLatest(registerUser.type, handleRegister);
}

export default authSaga;
