import mongoose, { Schema, Document } from "mongoose";
import { IMessage, MessageSchema } from "./Message";

export enum ContentType {
  BLOG_POST_OUTLINE = "BLOG_POST_OUTLINE",
  PRODUCT_DESCRIPTION = "PRODUCT_DESCRIPTION",
  SOCIAL_MEDIA_CAPTION = "SOCIAL_MEDIA_CAPTION",
}

export interface IConversation extends Document {
  userId: string;
  title: string;
  contentType: ContentType;
  messages: IMessage[];
}

const ConversationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    contentType: { type: String, required: true },
    messages: {
      type: [MessageSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
export default Conversation;
