import CustomError from "../models/CustomError";

export default class ValidationExceptions {
  static USER_NOT_FOUND = new CustomError(10000, "User Not Found");
  static USER_ALREADY_REGISTERED = new CustomError(
    10001,
    "User Already Registered!"
  );
  static INVALID_PASSWORD = new CustomError(10002, "Invalid Password");
  static CONVERSATION_NOT_FOUND = new CustomError(
    10003,
    "Conversation Not Found"
  );
  static USER_NOT_AUTHORIZED = new CustomError(10004, "User Not Authorized");
  static CONVERSATION_MAX_MESSAGES_LIMIT_REACHED = new CustomError(
    10005,
    "Conversation messages limit reached. Please create a new topic."
  );
  static CONTENT_GENERATION_JOB_NOT_FOUND = new CustomError(
    10006,
    "Content Generation Job Not Found"
  );
}
