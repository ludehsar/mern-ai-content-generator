import {
  JsonController,
  Body,
  Post,
  Req,
  UseBefore,
  Get,
  Param,
} from "routing-controllers";
import { Request } from "express";
import { SuccessResponse } from "../../models/SuccessResponse";
import { Container } from "typedi";
import { JWTMiddleware } from "../../middlewares/JwtMiddleware";
import { IUser } from "../user/models/User";
import { IConversationService } from "./IConversationService";
import { ConversationService } from "./ConversationService";
import CreateConversationDto from "./models/CreateConversationDto";

@JsonController()
export default class ConversationController {
  public conversationService: IConversationService =
    Container.get(ConversationService);

  @Post("/generate-content")
  @UseBefore(JWTMiddleware)
  async generateContent(
    @Req() request: Request,
    @Body() generateContentDto: CreateConversationDto
  ) {
    const result = await this.conversationService.enqueueConversation(
      request.user as IUser,
      generateContentDto
    );
    return new SuccessResponse(result.getValue());
  }

  @Get("/conversations")
  @UseBefore(JWTMiddleware)
  async getConversations(@Req() request: Request) {
    const result = await this.conversationService.getConversationsOfUser(
      request.user as IUser
    );
    return new SuccessResponse(result.getValue());
  }

  @Get("/content/:jobId/status")
  async getContentStatus(@Param("jobId") jobId: string) {
    const result = await this.conversationService.getContentGenerationJobStatus(
      jobId
    );
    return new SuccessResponse(result.getValue());
  }
}
