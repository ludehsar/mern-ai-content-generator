import { IsEnum, MinLength } from "class-validator";
import { ContentType } from "./Conversation";

export default class CreateConversationDto {
  @MinLength(3, { message: "Prompt must be at least 3 chars long" })
  prompt!: string;

  @IsEnum(ContentType, { message: "Content type must be a valid content type" })
  contentType!: ContentType;
}
