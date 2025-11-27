import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ContentType } from "../../server/contents/models/Conversation";

export interface IJobData {
  id?: string;
  timestamp?: Date;
}

export class ContentGenerationJobData implements IJobData {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsEnum(ContentType)
  @IsNotEmpty()
  contentType!: ContentType;

  id?: string;
  timestamp?: Date;
}
