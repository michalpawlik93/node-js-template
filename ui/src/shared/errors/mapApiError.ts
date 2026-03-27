import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/shared/types/ApiResponse';
import type { AppError } from '@/shared/errors/AppError';
import { isAppError } from '@/shared/errors/AppError';

const fallbackError: AppError = {
  code: 'UNKNOWN_ERROR',
  userMessage: 'Unexpected error. Please try again.',
};

const mapBackendTypeToCode = (backendType?: string): AppError['code'] => {
  switch (backendType) {
    case 'ValidationError':
      return 'VALIDATION_ERROR';
    case 'UnauthorizedError':
      return 'UNAUTHORIZED';
    case 'ForbiddenError':
      return 'FORBIDDEN';
    case 'NotFoundError':
      return 'NOT_FOUND';
    case 'TimeoutError':
      return 'TIMEOUT';
    case 'RateLimitError':
      return 'RATE_LIMIT';
    case 'SystemError':
      return 'SYSTEM_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
};

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (isAxiosError<ApiErrorResponse>(error)) {
    const backendType = error.response?.data?.error?.type;
    const backendMessage = error.response?.data?.error?.message;
    const code = mapBackendTypeToCode(backendType);

    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        userMessage: 'Network error. Check your connection.',
        technicalMessage: error.message,
      };
    }

    return {
      code,
      userMessage: backendMessage ?? 'Request failed.',
      technicalMessage: error.message,
      status: error.response.status,
      backendType,
    };
  }

  if (error instanceof Error) {
    return {
      ...fallbackError,
      technicalMessage: error.message,
    };
  }

  return fallbackError;
}
