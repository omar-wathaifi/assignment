import { describe, expect, it } from "vitest";

import {
  getAllGames,
  getCategories,
  getCategoryById,
  getGameById,
  getGamesByCategory,
} from "@/lib/catalogue";
import { formatDate, formatMoney } from "@/lib/format";

describe("catalogue data", () => {
  it("has at least the three required categories", () => {
    const ids = getCategories().map((category) => category.id);

    expect(ids).toEqual(expect.arrayContaining(["strategy", "family", "party"]));
    expect(ids.length).toBeGreaterThanOrEqual(3);
  });

  it("gives every category several games", () => {
    for (const category of getCategories()) {
      expect(getGamesByCategory(category.id).length).toBeGreaterThanOrEqual(3);
    }
  });

  it("uses unique ids for categories and games", () => {
    const categoryIds = getCategories().map((category) => category.id);
    const gameIds = getAllGames().map((game) => game.id);

    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    expect(new Set(gameIds).size).toBe(gameIds.length);
  });

  it("points every game at a category that exists", () => {
    for (const game of getAllGames()) {
      expect(getCategoryById(game.categoryId)).toBeDefined();
    }
  });

  it("prices the whole catalogue in one currency", () => {
    const currencies = new Set(getAllGames().map((game) => game.currency));

    expect([...currencies]).toEqual(["JOD"]);
  });

  it("gives every game the required shape and renderable values", () => {
    for (const game of getAllGames()) {
      expect(game.name.length).toBeGreaterThan(0);
      expect(game.description.length).toBeGreaterThan(20);
      expect(game.price).toBeGreaterThan(0);
      expect(game.currency).toMatch(/^[A-Z]{3}$/);
      expect(game.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(game.imageUrl).toMatch(/^\/images\/.+\.svg$/);

      // Both formatters must accept the stored values.
      expect(() => formatDate(game.releaseDate)).not.toThrow();
      expect(formatMoney(game.price, game.currency)).toMatch(/^\d+\.\d{2} [A-Z]{3}$/);
    }
  });
});

describe("catalogue lookups", () => {
  it("returns only the games in the requested category", () => {
    const strategyGames = getGamesByCategory("strategy");

    expect(strategyGames.length).toBeGreaterThan(0);
    expect(strategyGames.every((game) => game.categoryId === "strategy")).toBe(true);
  });

  it("returns an empty list for a category with no games", () => {
    expect(getGamesByCategory("does-not-exist")).toEqual([]);
  });

  it("finds a game by id and returns undefined for an unknown one", () => {
    expect(getGameById("azul")?.name).toBe("Azul");
    expect(getGameById("not-a-game")).toBeUndefined();
  });
});
