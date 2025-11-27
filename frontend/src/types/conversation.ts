export enum ContentType {
  BLOG_POST_OUTLINE = "BLOG_POST_OUTLINE",
  PRODUCT_DESCRIPTION = "PRODUCT_DESCRIPTION",
  SOCIAL_MEDIA_CAPTION = "SOCIAL_MEDIA_CAPTION",
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  contentType: ContentType;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
}

export interface CreateConversationDto {
  prompt: string;
  contentType: ContentType;
}

export interface GenerateContentResponse {
  jobId: string;
}

export interface JobStatusData {
  userId: string;
  prompt: string;
  contentType: ContentType;
}

export interface JobStatusResult {
  conversation: Conversation;
}

export interface JobStatusResponse {
  jobId: string;
  state: "waiting" | "active" | "completed" | "failed" | "delayed";
  progress: number;
  data: JobStatusData;
  result?: JobStatusResult;
  error?: string;
}
