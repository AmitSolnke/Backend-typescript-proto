export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}
