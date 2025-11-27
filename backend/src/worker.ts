import "reflect-metadata";
import { Container } from "typedi";
import { QueueService } from "./queue/QueueService";
import mongoose from "mongoose";
import config from "./config";

/**
 * Worker Process
 * Dedicated process for queue processing
 * Run separately from the API server for better scalability
 */
async function startWorker() {
  mongoose
    .connect(config.mongodbURI)
    .then(() => {
      try {
        console.log("🔧 Starting worker process...");

        const queueService = Container.get(QueueService);

        console.log("✅ Worker initialized and processing jobs");
        console.log("📦 All queue processors are running");

        setInterval(async () => {
          const stats = await queueService.getAllQueueStats();
          console.log("\n📊 Queue Statistics:");
          console.log(JSON.stringify(stats, null, 2));
        }, 30000);

        const gracefulShutdown = async () => {
          console.log("\n🛑 Shutting down worker...");

          try {
            await queueService.closeAll();
            console.log("✅ All queues closed");
            process.exit(0);
          } catch (error) {
            console.error("❌ Error during shutdown:", error);
            process.exit(1);
          }
        };

        process.on("SIGTERM", gracefulShutdown);
        process.on("SIGINT", gracefulShutdown);
      } catch (error) {
        console.error("❌ Failed to start worker:", error);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

startWorker();
