import { Result } from "../../models/Result";
import { IUser } from "../user/models/User";
import CreateConversationDto from "./models/CreateConversationDto";

export interface IConversationService {
  createConversation: (
    user: IUser,
    createConversationDto: CreateConversationDto
  ) => Promise<Result>;
  getConversationsOfUser: (user: IUser) => Promise<Result>;
  getConversation: (user: IUser, conversationId: string) => Promise<Result>;
  deleteConversation: (user: IUser, conversationId: string) => Promise<Result>;
  addUserMessage: (
    user: IUser,
    conversationId: string,
    message: string
  ) => Promise<Result>;
}
