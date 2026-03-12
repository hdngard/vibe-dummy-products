import axios, { type AxiosError } from "axios";

export class ApiError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status: number | undefined) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function normalizeError(e: unknown): never {
  if (axios.isAxiosError(e)) {
    const axiosError = e as AxiosError<{ message?: string }>;
    const serverMessage = axiosError.response?.data?.message;
    throw new ApiError(
      serverMessage ?? e.message,
      axiosError.response?.status,
    );
  }
  throw e;
}
