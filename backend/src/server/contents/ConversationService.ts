import Container, { Service } from "typedi";
import { IConversationService } from "./IConversationService";
import { Result } from "../../models/Result";
import CreateConversationDto from "./models/CreateConversationDto";
import { IUser } from "../user/models/User";
import Conversation, { IConversation } from "./models/Conversation";
import ValidationExceptions from "../../constants/RuntimeExceptions";
import config from "../../config";
import { ContentGenerationQueue } from "../../queue/ContentGenerationQueue";
import { ContentGenerationJobData } from "../../queue/models/IQueueJob";
import OpenAI from "openai";
import { SYSTEM_PROMPTS } from "./models/SYSTEM_PROMPTS";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";

@Service()
export class ConversationService implements IConversationService {
  public contentGenerationQueue: ContentGenerationQueue = Container.get(
    ContentGenerationQueue
  );
  public openai: OpenAI = new OpenAI({
    apiKey: config.openaiApiKey,
  });

  enqueueConversation = async (
    user: IUser,
    createConversationDto: CreateConversationDto
  ): Promise<Result> => {
    const contentGenerationJob =
      await this.contentGenerationQueue.addContentGenerationJob({
        userId: user._id.toString(),
        prompt: createConversationDto.prompt,
        contentType: createConversationDto.contentType,
      });

    return Result.succesful({
      jobId: contentGenerationJob.id,
    });
  };

  createConversation = async (
    contentGenerationJobData: ContentGenerationJobData
  ) => {
    const conversation = new Conversation({
      userId: contentGenerationJobData.userId,
      title: "Untitled Conversation",
      contentType: contentGenerationJobData.contentType,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS[contentGenerationJobData.contentType],
        },
        {
          content: contentGenerationJobData.prompt,
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

  getConversation = async (conversationId: string): Promise<Result> => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError(
        ValidationExceptions.CONVERSATION_NOT_FOUND.message
      );
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
      throw new NotFoundError(
        ValidationExceptions.CONVERSATION_NOT_FOUND.message
      );
    }
    if (conversation.userId.toString() !== user._id.toString()) {
      throw new UnauthorizedError(
        ValidationExceptions.USER_NOT_AUTHORIZED.message
      );
    }
    await conversation.deleteOne();
    return Result.succesful({
      message: "Conversation deleted successfully",
      conversation: {
        ...conversation.toObject(),
      },
    });
  };

  generateOpenAiResponse = async (
    conversation: IConversation
  ): Promise<Result> => {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 1,
      messages: [
        ...conversation.messages.map((message) => ({
          role: message.role as "user" | "assistant" | "system",
          content: message.content,
        })),
      ],
    });
    return Result.succesful({
      response: response.choices[0].message.content,
    });
  };

  addUserMessageToConversationQueue = async (
    user: IUser,
    conversationId: string,
    message: string
  ): Promise<Result> => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError(
        ValidationExceptions.CONVERSATION_NOT_FOUND.message
      );
    }
    if (conversation.userId.toString() !== user._id.toString()) {
      throw new UnauthorizedError(
        ValidationExceptions.USER_NOT_AUTHORIZED.message
      );
    }

    // 2 because we have user and assistant messages + 1 because we have the initial message
    if (
      conversation.messages.length >=
      config.conversationMaxMessagesLimit * 2 + 1
    ) {
      throw new BadRequestError(
        ValidationExceptions.CONVERSATION_MAX_MESSAGES_LIMIT_REACHED.message
      );
    }
    await Conversation.updateOne(
      { _id: conversation._id },
      { $push: { messages: { content: message, role: "user" } } }
    );
    return Result.succesful({
      message: "Message added successfully",
    });
  };

  addMessageToConversation = async (
    conversation: IConversation,
    message: string,
    role: "user" | "assistant" | "system"
  ): Promise<Result> => {
    await Conversation.updateOne(
      { _id: conversation._id },
      { $push: { messages: { content: message, role } } }
    );
    return Result.succesful({
      message: "Message added successfully",
    });
  };

  getContentGenerationJobStatus = async (jobId: string): Promise<Result> => {
    const job = await this.contentGenerationQueue.getJob(jobId);
    if (!job) {
      throw new NotFoundError(
        ValidationExceptions.CONTENT_GENERATION_JOB_NOT_FOUND.message
      );
    }

    const state = await job.getState();
    const progress = (await job.progress()) || 0;

    const jobStatus: any = {
      jobId: job.id,
      state,
      progress,
      data: job.data,
    };

    if (state === "completed") {
      const returnValue = job.returnvalue;
      if (returnValue) {
        if (
          returnValue.getValue &&
          typeof returnValue.getValue === "function"
        ) {
          jobStatus.result = returnValue.getValue();
        } else if (returnValue._value !== undefined) {
          jobStatus.result = returnValue._value;
        } else {
          jobStatus.result = returnValue;
        }
      }
    }

    if (state === "failed") {
      jobStatus.error = job.failedReason;
    }

    return Result.succesful(jobStatus);
  };
}
