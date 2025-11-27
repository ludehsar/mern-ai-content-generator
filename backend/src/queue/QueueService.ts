import Container, { Service } from "typedi";
import { ContentGenerationQueue } from "./ContentGenerationQueue";
import { ContentGenerationJobData } from "./models/IQueueJob";
import { Job } from "bull";
import { ContentGenerationProcessor } from "./ContentGenerationProcessor";
import { IQueue } from "./models/IQueue";
import { IProcessor } from "./models/IProcessor";

@Service()
export class QueueService {
  private readonly contentGenerationQueue: IQueue<ContentGenerationJobData> =
    Container.get(ContentGenerationQueue);
  private readonly contentGenerationProcessor: IProcessor<ContentGenerationJobData> =
    Container.get(ContentGenerationProcessor);

  constructor() {
    this.initializeProcessors();
  }

  private initializeProcessors(): void {
    this.contentGenerationQueue.process(
      5,
      async (job: Job<ContentGenerationJobData>) => {
        try {
          const result = await this.contentGenerationProcessor.process(job);
          await this.contentGenerationProcessor.onCompleted?.(job, result);
          return result;
        } catch (error) {
          await this.contentGenerationProcessor.onFailed?.(job, error as Error);
          throw error;
        }
      }
    );

    console.log("✅ All queue processors initialized");
  }

  async addContentGenerationJob(data: ContentGenerationJobData) {
    return this.contentGenerationQueue.addJob(data);
  }

  async getContentGenerationQueueStats() {
    return {
      name: this.contentGenerationQueue.getName(),
      counts: await this.contentGenerationQueue.getJobCounts(),
    };
  }

  async getAllQueueStats() {
    return {
      contentGeneration: await this.getContentGenerationQueueStats(),
    };
  }

  async cleanCompletedJobs(queueName: string, gracePeriodMs = 86400000) {
    const queue = this.getQueueByName(queueName);
    return queue.clean(gracePeriodMs, "completed");
  }

  async cleanFailedJobs(queueName: string, gracePeriodMs = 604800000) {
    const queue = this.getQueueByName(queueName);
    return queue.clean(gracePeriodMs, "failed");
  }

  async closeAll(): Promise<void> {
    await Promise.all([this.contentGenerationQueue.close()]);
    console.log("All queues closed");
  }

  private getQueueByName(name: string) {
    switch (name) {
      case "content-generation":
        return this.contentGenerationQueue;
      default:
        throw new Error(`Unknown queue: ${name}`);
    }
  }
}
