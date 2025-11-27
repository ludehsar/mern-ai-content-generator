import { Service } from "typedi";
import { BaseQueue } from "./BaseQueue";
import { ContentGenerationJobData } from "./models/IQueueJob";

@Service()
export class ContentGenerationQueue extends BaseQueue<ContentGenerationJobData> {
  constructor() {
    super("content-generation");
    this.setupContentGenerationEventHandlers();
  }

  private setupContentGenerationEventHandlers(): void {
    this.onCompleted((job, result) => {
      console.log(`✅ Content generation job ${job.id} completed successfully`);
    });

    this.onFailed((job, error) => {
      console.error(
        `❌ Failed to generate content for job ${job.id}:`,
        error.message
      );
    });
  }

  public async addContentGenerationJob(data: ContentGenerationJobData) {
    return this.addJob(data, {
      priority: 1,
      attempts: 3,
      delay: 60000,
    });
  }

  public async getContentGenerationJob(jobId: string) {
    return this.getJob(jobId);
  }
}
