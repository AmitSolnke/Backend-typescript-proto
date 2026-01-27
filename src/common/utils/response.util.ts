import { SuccessResponse, ErrorResponse } from '../types/response';

export function buildSuccessResponse<T>(data: T, message = ''): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function buildErrorResponse(message: string): ErrorResponse {
  return {
    success: false,
    message,
  };
}
