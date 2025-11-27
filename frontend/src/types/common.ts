export interface Response<T> {
  data: T;
  message?: string;
  status: string;
  statusCode: number;
  errors?: unknown[];
}

export interface ErrorResponse {
  errorCode: number;
  message: string;
  status: string;
  statusCode: number;
}
