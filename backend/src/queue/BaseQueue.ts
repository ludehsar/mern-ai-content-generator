import Bull, { Job, JobOptions, Queue } from "bull";
import QueueConfig from "../config/queue.config";
import { IQueue, IQueueEvents } from "./models/IQueue";

export abstract class BaseQueue<T = any> implements IQueue<T>, IQueueEvents {
  protected queue: Queue<T>;
  protected readonly queueName: string;

  constructor(queueName: string) {
    this.queueName = queueName;
    this.queue = new Bull<T>(queueName, QueueConfig.getQueueOptions(queueName));

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.queue.on("error", (error) => {
      console.error(`[${this.queueName}] Queue error:`, error);
    });

    this.queue.on("waiting", (jobId) => {
      console.log(`[${this.queueName}] Job ${jobId} is waiting`);
    });

    this.queue.on("active", (job) => {
      console.log(`[${this.queueName}] Job ${job.id} started processing`);
    });

    this.queue.on("stalled", (job) => {
      console.warn(`[${this.queueName}] Job ${job.id} has stalled`);
    });
  }

  public async addJob(data: T, options?: JobOptions): Promise<Job<T>> {
    try {
      const job = await this.queue.add(data, options);
      console.log(`[${this.queueName}] Job ${job.id} added to queue`);
      return job;
    } catch (error) {
      console.error(`[${this.queueName}] Failed to add job:`, error);
      throw error;
    }
  }

  public process(
    concurrency: number,
    processor: (job: Job<T>) => Promise<any>
  ): void {
    this.queue.process(concurrency, async (job) => {
      try {
        return await processor(job);
      } catch (error) {
        console.error(`[${this.queueName}] Job ${job.id} failed:`, error);
        throw error;
      }
    });
  }

  public getQueue(): Queue<T> {
    return this.queue;
  }

  public getName(): string {
    return this.queueName;
  }

  public async close(): Promise<void> {
    await this.queue.close();
  }

  public async getJobCounts(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    return await this.queue.getJobCounts();
  }

  public async clean(
    grace: number,
    status: "completed" | "failed"
  ): Promise<Job<T>[]> {
    return await this.queue.clean(grace, status);
  }

  public onCompleted(callback: (job: Job<T>, result: any) => void): void {
    this.queue.on("completed", callback);
  }

  public onFailed(callback: (job: Job<T>, error: Error) => void): void {
    this.queue.on("failed", callback);
  }

  public onProgress(callback: (job: Job<T>, progress: number) => void): void {
    this.queue.on("progress", callback);
  }

  public onError(callback: (error: Error) => void): void {
    this.queue.on("error", callback);
  }

  public async getFailedJobs(start = 0, end = 10): Promise<Job<T>[]> {
    return await this.queue.getFailed(start, end);
  }

  public async retryJob(jobId: string): Promise<void> {
    const job = await this.queue.getJob(jobId);
    if (job) {
      await job.retry();
    }
  }

  public async removeJob(jobId: string): Promise<void> {
    const job = await this.queue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  public async getJob(jobId: string): Promise<Job<T> | null> {
    return await this.queue.getJob(jobId);
  }
}
