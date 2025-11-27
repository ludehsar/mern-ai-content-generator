import { Job } from "bull";

/**
 * Interface for job processors
 * Each processor handles specific job types
 */
export interface IProcessor<T = any> {
  /**
   * Process a job
   * @param job - The job to process
   * @returns Result of processing
   */
  process(job: Job<T>): Promise<any>;

  /**
   * Handle job failure
   * @param job - The failed job
   * @param error - The error that occurred
   */
  onFailed?(job: Job<T>, error: Error): Promise<void>;

  /**
   * Handle job completion
   * @param job - The completed job
   * @param result - The result of processing
   */
  onCompleted?(job: Job<T>, result: any): Promise<void>;
}
