import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import conversationSaga from "./conversationSaga";

function* rootSaga() {
  yield all([authSaga(), conversationSaga()]);
}

export default rootSaga;
