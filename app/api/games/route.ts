import { errorResponse, successResponse } from "@/lib/api";
import { getCategoryById, getGamesByCategory } from "@/lib/catalogue";

/**
 * GET /api/games?categoryId=strategy
 *
 * Serves the catalogue to the browser so the category page can show real
 * loading, error, empty and success states.
 */
export function GET(request: Request) {
  const categoryId = new URL(request.url).searchParams.get("categoryId")?.trim();

  if (!categoryId) {
    return errorResponse(
      "MISSING_CATEGORY_ID",
      'Provide a "categoryId", for example /api/games?categoryId=strategy.',
      400,
    );
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    return errorResponse(
      "CATEGORY_NOT_FOUND",
      `There is no category called "${categoryId}" in the catalogue.`,
      404,
    );
  }

  return successResponse({ category, games: getGamesByCategory(category.id) });
}
