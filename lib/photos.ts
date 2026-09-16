/**
 * Picks the Unsplash photo for a single game.
 *
 * Server-side only: it reaches Unsplash through `lib/unsplash.ts`, so the
 * access key stays on the server. The search and the index match the ones the
 * category grid uses, so a game's card and its detail page show the same photo.
 */

import type { Category, Game } from "@/lib/catalogue";
import { getGamesByCategory } from "@/lib/catalogue";
import type { Photo } from "@/lib/photo";
import { searchPhotos } from "@/lib/unsplash";

export async function getGamePhoto(game: Game, category: Category): Promise<Photo | null> {
  const games = getGamesByCategory(category.id);
  const index = games.findIndex((candidate) => candidate.id === game.id);

  if (index < 0) {
    return null;
  }

  try {
    const photos = await searchPhotos(category.photoQuery, games.length);
    return photos[index] ?? null;
  } catch (error) {
    // Photography is an enhancement: fall back to the local placeholder cover.
    console.warn(
      `Unsplash photo unavailable for "${game.id}":`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
