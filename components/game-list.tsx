"use client";

import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { GameCard } from "@/components/game-card";
import { SkeletonGrid } from "@/components/skeleton-grid";
import { messageFromErrorBody } from "@/lib/api";
import type { Game } from "@/lib/catalogue";
import { usePhotos } from "@/lib/use-photos";

type ListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; games: Game[] };

/**
 * The games grid for one category.
 *
 * Loads from `/api/games` in the browser so all four states are real:
 * loading (skeleton cards), error (with retry), empty (with a next step) and
 * success (the grid).
 */
export function GameList({
  categoryId,
  categoryName,
  photoQuery,
}: {
  categoryId: string;
  categoryName: string;
  photoQuery: string;
}) {
  const [state, setState] = useState<ListState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setState({ status: "loading" });

    async function load() {
      try {
        const response = await fetch(
          `/api/games?categoryId=${encodeURIComponent(categoryId)}`,
        );
        const body: unknown = await response.json();

        if (!response.ok) {
          throw new Error(
            messageFromErrorBody(body, "The catalogue service returned an unexpected response."),
          );
        }

        const games = (body as { data?: { games?: Game[] } }).data?.games;

        if (!Array.isArray(games)) {
          throw new Error("The catalogue service returned an unexpected response.");
        }

        if (!cancelled) {
          setState({ status: "success", games });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "The catalogue service could not be reached.",
          });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [categoryId, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  if (state.status === "loading") {
    return <SkeletonGrid />;
  }

  if (state.status === "error") {
    return (
      <ErrorState
        title={`We could not load the ${categoryName} games`}
        description={`${state.message} Your connection or the catalogue service may be temporarily unavailable.`}
        onRetry={retry}
      />
    );
  }

  if (state.games.length === 0) {
    return (
      <EmptyState
        title={`No ${categoryName.toLowerCase()} games yet`}
        description="Nothing has been added to this category so far. Try another category, or check back after the next catalogue update."
      />
    );
  }

  return <LoadedGames games={state.games} photoQuery={photoQuery} />;
}

/**
 * Separate component so the photo request starts only once games exist, and
 * so its hook is not called conditionally.
 */
function LoadedGames({ games, photoQuery }: { games: Game[]; photoQuery: string }) {
  const { photos, failureReason } = usePhotos(photoQuery, games.length);

  return (
    <section aria-labelledby="games-heading">
      <h2 id="games-heading" className="sr-only">
        Games in this category
      </h2>
      {failureReason ? (
        <p className="mb-6 rounded-md border border-line bg-surface px-4 py-3 text-sm text-muted">
          Showing local placeholder covers: live photography is unavailable right now.
        </p>
      ) : null}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game, index) => (
          <li key={game.id}>
            <GameCard game={game} photo={photos?.[index] ?? null} />
          </li>
        ))}
      </ul>
    </section>
  );
}
