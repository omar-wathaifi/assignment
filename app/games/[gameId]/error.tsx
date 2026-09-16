"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";

export default function GameError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Game detail page failed to render:", error);
  }, [error]);

  return (
    <>
      <PageHeader
        eyebrow="Game"
        title="This game could not be opened"
        description="The page stopped while it was being prepared, so the game details are not showing."
      />
      <ErrorState
        title="Something went wrong loading this game"
        description="The detail page failed to render. Try again, and if the problem continues browse the category listing instead."
        onRetry={reset}
        retryLabel="Try again"
      />
    </>
  );
}
