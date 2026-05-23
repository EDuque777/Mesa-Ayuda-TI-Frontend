import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface NestErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNestErrorResponse = (value: unknown): value is NestErrorResponse =>
  isRecord(value) &&
  (!("message" in value) ||
    typeof value.message === "string" ||
    (Array.isArray(value.message) &&
      value.message.every((item) => typeof item === "string")));

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  isRecord(error) && "status" in error;

const isSerializedError = (error: unknown): error is SerializedError =>
  isRecord(error) &&
  ("message" in error || "name" in error || "code" in error || "stack" in error);

const normalizeMessage = (message: string | string[]) =>
  Array.isArray(message) ? message.join("\n") : message;

export const getApiErrorMessage = (
  error: unknown,
  fallback = "No pudimos completar la solicitud. Intenta nuevamente.",
) => {
  if (isFetchBaseQueryError(error)) {
    if (isNestErrorResponse(error.data) && error.data.message) {
      return normalizeMessage(error.data.message);
    }

    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
  }

  if (isSerializedError(error) && typeof error.message === "string") {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
