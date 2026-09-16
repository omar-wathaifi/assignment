/**
 * Server-only Unsplash client.
 *
 * `UNSPLASH_ACCESS_KEY` is read from the server environment and never leaves
 * it: the browser talks to `/api/photos`, which calls this module.
 */

import "server-only";

import type { Photo } from "@/lib/photo";

export const UNSPLASH_TIMEOUT_MS = 5_000;
export const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos";

/** How long a successful search is cached before Unsplash is called again. */
const CACHE_SECONDS = 86_400;

export type UnsplashErrorCode =
  | "MISSING_API_KEY"
  | "INVALID_API_KEY"
  | "UPSTREAM_TIMEOUT"
  | "UPSTREAM_ERROR"
  | "UPSTREAM_UNAVAILABLE";

export class UnsplashError extends Error {
  readonly code: UnsplashErrorCode;
  readonly status: number;

  constructor(code: UnsplashErrorCode, message: string, status: number) {
    super(message);
    this.name = "UnsplashError";
    this.code = code;
    this.status = status;
  }
}

export type { Photo };

interface UnsplashSearchResponse {
  results?: Array<{
    id?: string;
    alt_description?: string | null;
    description?: string | null;
    urls?: { small?: string; regular?: string };
    user?: { name?: string; links?: { html?: string } };
  }>;
}

/**
 * Searches Unsplash for `count` landscape photos.
 *
 * Throws `UnsplashError` for every failure mode so the route handler can map
 * each one onto the shared error envelope.
 */
export async function searchPhotos(query: string, count: number): Promise<Photo[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

  if (!accessKey) {
    throw new UnsplashError(
      "MISSING_API_KEY",
      "Unsplash is not configured on the server. Set UNSPLASH_ACCESS_KEY and restart the app.",
      503,
    );
  }

  const url = new URL(UNSPLASH_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(count));
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      signal: AbortSignal.timeout(UNSPLASH_TIMEOUT_MS),
      next: { revalidate: CACHE_SECONDS },
    });
  } catch (error) {
    if (isTimeout(error)) {
      throw new UnsplashError(
        "UPSTREAM_TIMEOUT",
        `Unsplash did not respond within ${UNSPLASH_TIMEOUT_MS / 1000} seconds.`,
        504,
      );
    }

    throw new UnsplashError(
      "UPSTREAM_UNAVAILABLE",
      "Could not reach Unsplash. Check the server's network connection and try again.",
      502,
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new UnsplashError(
      "INVALID_API_KEY",
      "Unsplash rejected the server's access key. Check UNSPLASH_ACCESS_KEY.",
      502,
    );
  }

  if (!response.ok) {
    throw new UnsplashError(
      "UPSTREAM_ERROR",
      `Unsplash responded with status ${response.status}.`,
      502,
    );
  }

  const body = (await response.json()) as UnsplashSearchResponse;

  return (body.results ?? []).flatMap((result) => {
    const url = result.urls?.small ?? result.urls?.regular;

    if (!result.id || !url) {
      return [];
    }

    return [
      {
        id: result.id,
        url,
        largeUrl: result.urls?.regular ?? url,
        alt: result.alt_description?.trim() || result.description?.trim() || `Photo of ${query}`,
        credit: {
          name: result.user?.name ?? "Unsplash contributor",
          profileUrl: result.user?.links?.html ?? "https://unsplash.com",
        },
      },
    ];
  });
}

function isTimeout(error: unknown): boolean {
  return (
    error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
  );
}
