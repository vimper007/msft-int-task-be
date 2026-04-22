export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
  meta?: object;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}
