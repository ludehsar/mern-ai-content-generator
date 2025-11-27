import { takeLatest, put, call } from "redux-saga/effects";
import {
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  getUser,
  registerUser,
} from "../slices/authSlice";
import type { User } from "@/types/auth";
import {
  loginUser as loginUserApi,
  registerUser as registerUserApi,
  getUser as getUserApi,
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

function* handleGetUser() {
  try {
    const user = (yield call(getUserApi)) as User;
    yield put(loginUserSuccess(user));
  } catch (error) {
    yield put(loginUserFailure(error as Error));
  }
}

function* authSaga() {
  yield takeLatest(loginUser.type, handleLogin);
  yield takeLatest(registerUser.type, handleRegister);
  yield takeLatest(getUser.type, handleGetUser);
}

export default authSaga;
