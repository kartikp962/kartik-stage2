import { QueryClient } from '@tanstack/react-query';
import { ApiError, InvalidResponseError } from './client';

const MAX_RETRIES = 2;

// Retry only failures that might succeed on a second attempt:
// network errors and 5xx. A 4xx or a malformed body will fail the same way again.
function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof InvalidResponseError) return false;
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
    },
  },
});
