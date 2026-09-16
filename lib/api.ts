/**
 * Shared shape for every JSON response served from `app/api`.
 *
 * Errors always look like:
 *   { "error": { "code": "SOME_ERROR_CODE", "message": "Human readable message" } }
 */

import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export interface ApiSuccessBody<TData> {
  data: TData;
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function successResponse<TData>(data: TData): NextResponse<ApiSuccessBody<TData>> {
  return NextResponse.json({ data });
}

/** Pulls a human readable message out of an unknown error response body. */
export function messageFromErrorBody(body: unknown, fallback: string): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof (body as ApiErrorBody).error?.message === "string"
  ) {
    return (body as ApiErrorBody).error.message;
  }

  return fallback;
}
