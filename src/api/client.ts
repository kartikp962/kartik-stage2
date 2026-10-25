// Minimal typed HTTP client. Every response is validated by a parser before
// it reaches the app, so components never receive unchecked `unknown` data
// and we avoid `as T` casts on API responses.

/** The server responded, but with a non-2xx status. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** The server responded with 2xx, but the body was not the shape we expect. */
export class InvalidResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidResponseError';
  }
}

export type Parser<T> = (data: unknown) => T;

export async function apiGet<T>(path: string, parse: Parser<T>, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  return parse(data);
}
