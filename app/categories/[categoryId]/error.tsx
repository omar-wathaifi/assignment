"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Category page failed to render:", error);
  }, [error]);

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title="This category could not be opened"
        description="The page stopped while it was being prepared, so the games are not showing."
      />
      <ErrorState
        title="Something went wrong loading this category"
        description="The catalogue page failed to render. This is usually temporary — try again, and if it keeps happening go back to the catalogue home page."
        onRetry={reset}
        retryLabel="Try again"
      />
    </>
  );
}
