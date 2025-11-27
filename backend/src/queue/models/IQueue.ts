import { Job, JobOptions, Queue } from "bull";

export interface IQueue<T = any> {
  /**
   * Add a job to the queue
   */
  addJob(data: T, options?: JobOptions): Promise<Job<T>>;

  /**
   * Process jobs in the queue
   */
  process(concurrency: number, processor: (job: Job<T>) => Promise<any>): void;

  /**
   * Get queue instance for advanced operations
   */
  getQueue(): Queue<T>;

  /**
   * Get queue name
   */
  getName(): string;

  /**
   * Close queue connection
   */
  close(): Promise<void>;

  /**
   * Get job counts
   */
  getJobCounts(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }>;

  /**
   * Clean old jobs
   */
  clean(grace: number, status: "completed" | "failed"): Promise<Job<T>[]>;

  /**
   * Get a job by id
   */
  getJob(jobId: string): Promise<Job<T> | null>;
}

export interface IQueueEvents {
  onCompleted(callback: (job: Job, result: any) => void): void;
  onFailed(callback: (job: Job, error: Error) => void): void;
  onProgress(callback: (job: Job, progress: number) => void): void;
  onError(callback: (error: Error) => void): void;
}
