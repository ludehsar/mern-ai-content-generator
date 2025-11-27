import apiClient from "@/lib/apiClient";
import type { Response } from "@/types/common";
import type {
  Conversation,
  CreateConversationDto,
  GenerateContentResponse,
  GetConversationsResponse,
  JobStatusResponse,
} from "@/types/conversation";

export const generateContent = async (dto: CreateConversationDto) => {
  try {
    const response = await apiClient.post<Response<GenerateContentResponse>>(
      "/generate-content",
      dto
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred during content generation");
  }
};

export const getConversations = async () => {
  try {
    const response = await apiClient.get<Response<GetConversationsResponse>>(
      "/conversations"
    );
    return response.data.data.conversations;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching conversations");
  }
};

export const getJobStatus = async (jobId: string) => {
  try {
    const response = await apiClient.get<Response<JobStatusResponse>>(
      `/content/${jobId}/status`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching job status");
  }
};

export const getConversation = async (conversationId: string) => {
  try {
    const response = await apiClient.get<
      Response<{ conversation: Conversation }>
    >(`/conversations/${conversationId}`);
    return response.data.data.conversation;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching conversation");
  }
};
