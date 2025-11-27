import Redis from "ioredis";
import { QueueOptions } from "bull";
import config from ".";

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  maxRetriesPerRequest: number | null;
}

export interface BullConfig {
  redis: RedisConfig;
  defaultJobOptions: QueueOptions["defaultJobOptions"];
}

export class QueueConfig {
  private static instance: QueueConfig;

  public readonly redisConfig: RedisConfig;
  public readonly bullConfig: BullConfig;

  private constructor() {
    this.redisConfig = {
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword,
      db: 0,
      maxRetriesPerRequest: null,
    };

    this.bullConfig = {
      redis: this.redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: false,
        removeOnFail: false,
      },
    };
  }

  public static getInstance(): QueueConfig {
    if (!QueueConfig.instance) {
      QueueConfig.instance = new QueueConfig();
    }
    return QueueConfig.instance;
  }

  public createRedisClient(): Redis {
    return new Redis(this.redisConfig);
  }

  public getQueueOptions(queueName: string): QueueOptions {
    return {
      redis: this.redisConfig,
      defaultJobOptions: this.bullConfig.defaultJobOptions,
      prefix: `bull:${queueName}`,
    };
  }
}

export default QueueConfig.getInstance();
