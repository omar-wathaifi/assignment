import { errorResponse, successResponse } from "@/lib/api";
import { searchPhotos, UnsplashError } from "@/lib/unsplash";

const DEFAULT_COUNT = 6;
const MAX_COUNT = 12;

/**
 * GET /api/photos?query=board%20games&count=6
 *
 * The only place Unsplash is called. `UNSPLASH_ACCESS_KEY` is read from the
 * server environment here and is never sent to the browser.
 */
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return errorResponse(
      "MISSING_QUERY",
      'Provide a "query" search term, for example /api/photos?query=board%20games.',
      400,
    );
  }

  const rawCount = searchParams.get("count");
  const count = rawCount === null ? DEFAULT_COUNT : Number(rawCount);

  if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
    return errorResponse(
      "INVALID_COUNT",
      `"count" must be a whole number between 1 and ${MAX_COUNT}.`,
      400,
    );
  }

  try {
    return successResponse({ photos: await searchPhotos(query, count) });
  } catch (error) {
    if (error instanceof UnsplashError) {
      return errorResponse(error.code, error.message, error.status);
    }

    return errorResponse(
      "INTERNAL_ERROR",
      "Something went wrong while fetching photos. Please try again.",
      500,
    );
  }
}
