import dotenv from "dotenv";
dotenv.config();

export default {
  applicationPort: Number(process.env.PORT ?? "4000"),
  mongodbURI: process.env.MONGODB_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  conversationMaxMessagesLimit: 5,
  redisPort: Number(process.env.REDIS_PORT ?? "6379"),
  redisPassword: process.env.REDIS_PASSWORD ?? "",
  redisHost: process.env.REDIS_HOST ?? "localhost",
};
