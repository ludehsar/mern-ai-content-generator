import dotenv from "dotenv";
dotenv.config();

export default {
  applicationPort: Number(process.env.PORT ?? "4000"),
  mongodbURI: process.env.MONGODB_URI ?? "",
};
