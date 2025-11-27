import { Service } from "typedi";
import { Job } from "bull";
import { IProcessor } from "./models/IProcessor";
import { ContentGenerationJobData } from "./models/IQueueJob";
import { Result } from "../models/Result";
import { ConversationService } from "../server/contents/ConversationService";

@Service()
export class ContentGenerationProcessor
  implements IProcessor<ContentGenerationJobData>
{
  constructor(private readonly conversationService: ConversationService) {}

  async process(job: Job<ContentGenerationJobData>): Promise<any> {
    console.log(`Processing content generation job ${job.id}`);

    await job.progress(10);

    const { conversation } = (
      await this.conversationService.createConversation(job.data)
    ).getValue();

    await job.progress(30);

    const { response } = (
      await this.conversationService.generateOpenAiResponse(conversation)
    ).getValue();

    await job.progress(70);

    await this.conversationService.addMessageToConversation(
      conversation,
      response,
      "assistant"
    );

    await job.progress(100);

    const { conversation: updatedConversation } = (
      await this.conversationService.getConversation(
        conversation._id.toString()
      )
    ).getValue();

    return Result.succesful({
      conversation: updatedConversation,
    });
  }

  async onFailed(
    job: Job<ContentGenerationJobData>,
    error: Error
  ): Promise<void> {
    console.error(
      `Content generation job ${job.id} failed after ${job.attemptsMade} attempts`,
      error
    );
  }
}
