import { Result } from "../../models/Result";
import { ContentGenerationJobData } from "../../queue/models/IQueueJob";
import { IUser } from "../user/models/User";
import { IConversation } from "./models/Conversation";
import CreateConversationDto from "./models/CreateConversationDto";

export interface IConversationService {
  enqueueConversation: (
    user: IUser,
    createConversationDto: CreateConversationDto
  ) => Promise<Result>;
  createConversation: (
    contentGenerationJobData: ContentGenerationJobData
  ) => Promise<Result>;
  getConversationsOfUser: (user: IUser) => Promise<Result>;
  getConversation: (conversationId: string) => Promise<Result>;
  deleteConversation: (user: IUser, conversationId: string) => Promise<Result>;
  generateOpenAiResponse: (conversation: IConversation) => Promise<Result>;
  addUserMessageToConversationQueue: (
    user: IUser,
    conversationId: string,
    message: string
  ) => Promise<Result>;
  addMessageToConversation: (
    conversation: IConversation,
    message: string,
    role: "user" | "assistant" | "system"
  ) => Promise<Result>;
  getContentGenerationJobStatus: (jobId: string) => Promise<Result>;
}
