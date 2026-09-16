/** Read access to the catalogue. The data itself lives in `data/catalogue.ts`. */

import { categories, games, type Category, type Game } from "@/data/catalogue";

export type { Category, Game };

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((category) => category.id === categoryId);
}

export function getGamesByCategory(categoryId: string): Game[] {
  return games.filter((game) => game.categoryId === categoryId);
}

export function getGameById(gameId: string): Game | undefined {
  return games.find((game) => game.id === gameId);
}

export function getAllGames(): Game[] {
  return games;
}

export function countGamesByCategory(categoryId: string): number {
  return getGamesByCategory(categoryId).length;
}
