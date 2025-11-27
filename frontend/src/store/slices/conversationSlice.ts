import type {
  Conversation,
  CreateConversationDto,
  JobStatusResponse,
} from "@/types/conversation";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  conversations: [] as Conversation[],
  currentConversation: null as Conversation | null,
  error: null as Error | null,
  status: "idle" as "idle" | "pending" | "complete" | "failed",
  generateStatus: "idle" as "idle" | "pending" | "complete" | "failed",
  jobStatus: null as JobStatusResponse | null,
  pollingJobId: null as string | null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state) {
      state.status = "pending";
      state.error = null;
    },
    fetchConversationsSuccess(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
      state.error = null;
      state.status = "complete";
    },
    fetchConversationsFailure(state, action: PayloadAction<Error>) {
      state.conversations = [];
      state.error = action.payload;
      state.status = "failed";
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateContent(state, _action: PayloadAction<CreateConversationDto>) {
      state.generateStatus = "pending";
      state.error = null;
    },
    generateContentSuccess(state) {
      state.generateStatus = "complete";
      state.error = null;
    },
    generateContentFailure(state, action: PayloadAction<Error>) {
      state.generateStatus = "failed";
      state.error = action.payload;
    },
    startPollingJobStatus(state, action: PayloadAction<string>) {
      state.pollingJobId = action.payload;
      state.generateStatus = "pending";
    },
    stopPollingJobStatus(state) {
      state.pollingJobId = null;
    },
    updateJobStatus(state, action: PayloadAction<JobStatusResponse>) {
      state.jobStatus = action.payload;
      if (action.payload.state === "completed") {
        state.generateStatus = "complete";
        state.pollingJobId = null;
        if (action.payload.result?.conversation) {
          state.currentConversation = action.payload.result.conversation;
        }
      } else if (action.payload.state === "failed") {
        state.generateStatus = "failed";
        state.pollingJobId = null;
        state.error = new Error(action.payload.error || "Job failed");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchConversation(state, _action: PayloadAction<string>) {
      state.status = "pending";
      state.error = null;
    },
    fetchConversationSuccess(state, action: PayloadAction<Conversation>) {
      state.currentConversation = action.payload;
      state.error = null;
      state.status = "complete";
    },
    fetchConversationFailure(state, action: PayloadAction<Error>) {
      state.currentConversation = null;
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

export const {
  fetchConversations,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  generateContent,
  generateContentSuccess,
  generateContentFailure,
  startPollingJobStatus,
  stopPollingJobStatus,
  updateJobStatus,
  fetchConversation,
  fetchConversationSuccess,
  fetchConversationFailure,
} = conversationSlice.actions;

export default conversationSlice.reducer;
