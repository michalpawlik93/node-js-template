export interface ApiSuccessResponse<T> {
  data: T;
  messages?: string[];
}

export interface ApiErrorResponse {
  error: {
    type: string;
    message: string;
  };
}
