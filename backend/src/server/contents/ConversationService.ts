import { Service } from "typedi";
import { IConversationService } from "./IConversationService";
import { Result } from "../../models/Result";
import CreateConversationDto from "./models/CreateConversationDto";
import { IUser } from "../user/models/User";
import Conversation from "./models/Conversation";
import ValidationExceptions from "../../constants/RuntimeExceptions";
import config from "../../config";

@Service()
export class ConversationService implements IConversationService {
  createConversation = async (
    user: IUser,
    createConversationDto: CreateConversationDto
  ): Promise<Result> => {
    const conversation = new Conversation({
      userId: user._id.toString(),
      title: "Untitled Conversation",
      contentType: createConversationDto.contentType,
      messages: [
        {
          content: createConversationDto.prompt,
          role: "user",
        },
      ],
    });
    await conversation.save();
    return Result.succesful({
      conversation: {
        ...conversation.toObject(),
      },
    });
  };

  getConversationsOfUser = async (user: IUser): Promise<Result> => {
    const conversations = await Conversation.find({
      userId: user._id.toString(),
    });
    return Result.succesful({
      conversations: conversations.map((conversation) => ({
        ...conversation.toObject(),
      })),
    });
  };

  getConversation = async (
    user: IUser,
    conversationId: string
  ): Promise<Result> => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return Result.failure(ValidationExceptions.CONVERSATION_NOT_FOUND);
    }
    if (conversation.userId.toString() !== user._id.toString()) {
      return Result.failure(ValidationExceptions.USER_NOT_AUTHORIZED);
    }
    return Result.succesful({
      conversation: {
        ...conversation.toObject(),
      },
    });
  };

  deleteConversation = async (
    user: IUser,
    conversationId: string
  ): Promise<Result> => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return Result.failure(ValidationExceptions.CONVERSATION_NOT_FOUND);
    }
    if (conversation.userId.toString() !== user._id.toString()) {
      return Result.failure(ValidationExceptions.USER_NOT_AUTHORIZED);
    }
    await conversation.deleteOne();
    return Result.succesful({
      message: "Conversation deleted successfully",
      conversation: {
        ...conversation.toObject(),
      },
    });
  };

  addUserMessage = async (
    user: IUser,
    conversationId: string,
    message: string
  ): Promise<Result> => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return Result.failure(ValidationExceptions.CONVERSATION_NOT_FOUND);
    }
    if (conversation.userId.toString() !== user._id.toString()) {
      return Result.failure(ValidationExceptions.USER_NOT_AUTHORIZED);
    }

    // 2 because we have user and assistant messages + 1 because we have the initial message
    if (
      conversation.messages.length >=
      config.conversationMaxMessagesLimit * 2 + 1
    ) {
      return Result.failure(
        ValidationExceptions.CONVERSATION_MAX_MESSAGES_LIMIT_REACHED
      );
    }
    await conversation.updateOne(
      { $push: { messages: { content: message, role: "user" } } },
      { new: true }
    );
    return Result.succesful({
      message: "Message added successfully",
    });
  };
}
