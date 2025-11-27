import { takeLatest, put, call, select, delay } from "redux-saga/effects";
import {
  fetchConversations,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  generateContent,
  generateContentFailure,
  startPollingJobStatus,
  stopPollingJobStatus,
  updateJobStatus,
  fetchConversation,
  fetchConversationSuccess,
  fetchConversationFailure,
} from "../slices/conversationSlice";
import type { Conversation, JobStatusResponse } from "@/types/conversation";
import {
  getConversations as getConversationsApi,
  generateContent as generateContentApi,
  getJobStatus as getJobStatusApi,
  getConversation as getConversationApi,
} from "@/api/conversation";
import type { RootState } from "../index";

function* handleFetchConversations() {
  try {
    const conversations = (yield call(getConversationsApi)) as Conversation[];
    yield put(fetchConversationsSuccess(conversations));
  } catch (error) {
    yield put(fetchConversationsFailure(error as Error));
  }
}

function* handleGenerateContent(action: ReturnType<typeof generateContent>) {
  try {
    const response = (yield call(generateContentApi, action.payload)) as {
      jobId: string;
    };
    yield put(startPollingJobStatus(response.jobId));
  } catch (error) {
    yield put(generateContentFailure(error as Error));
  }
}

function* pollJobStatus(jobId: string) {
  while (true) {
    try {
      const jobStatus = (yield call(
        getJobStatusApi,
        jobId
      )) as JobStatusResponse;
      yield put(updateJobStatus(jobStatus));

      if (jobStatus.state === "completed" || jobStatus.state === "failed") {
        yield put(stopPollingJobStatus());
        if (jobStatus.state === "completed") {
          yield put(fetchConversations());
        }
        break;
      }

      yield delay(2000);
    } catch (error) {
      yield put(generateContentFailure(error as Error));
      yield put(stopPollingJobStatus());
      break;
    }
  }
}

function* handleStartPolling(action: ReturnType<typeof startPollingJobStatus>) {
  yield call(pollJobStatus, action.payload);
}

function* handleFetchConversation(
  action: ReturnType<typeof fetchConversation>
) {
  try {
    const conversations = (yield select(
      (state: RootState) => state.conversation.conversations
    )) as Conversation[];
    let conversation = conversations.find((c) => c._id === action.payload);
    if (!conversation) {
      conversation = (yield call(
        getConversationApi,
        action.payload
      )) as Conversation;
    }
    yield put(fetchConversationSuccess(conversation));
  } catch (error) {
    yield put(fetchConversationFailure(error as Error));
  }
}

function* conversationSaga() {
  yield takeLatest(fetchConversations.type, handleFetchConversations);
  yield takeLatest(generateContent.type, handleGenerateContent);
  yield takeLatest(startPollingJobStatus.type, handleStartPolling);
  yield takeLatest(fetchConversation.type, handleFetchConversation);
}

export default conversationSaga;
