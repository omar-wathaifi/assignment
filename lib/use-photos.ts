"use client";

import { useEffect, useState } from "react";

import { messageFromErrorBody } from "@/lib/api";
import type { Photo } from "@/lib/photo";

/**
 * Progressive enhancement for card artwork.
 *
 * Asks `/api/photos` (which holds the Unsplash key server-side) for photos.
 * The catalogue never depends on the result: when the request fails the caller
 * keeps the local placeholder covers and shows a short notice instead.
 */
export function usePhotos(query: string, count: number) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [failureReason, setFailureReason] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setPhotos(null);
    setFailureReason(null);

    async function load() {
      try {
        const response = await fetch(
          `/api/photos?query=${encodeURIComponent(query)}&count=${count}`,
        );
        const body: unknown = await response.json();

        if (!response.ok) {
          throw new Error(messageFromErrorBody(body, "Unsplash photos are unavailable."));
        }

        if (!cancelled) {
          setPhotos(((body as { data?: { photos?: Photo[] } }).data?.photos ?? []) as Photo[]);
        }
      } catch (error) {
        if (!cancelled) {
          setFailureReason(error instanceof Error ? error.message : "Unsplash photos are unavailable.");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [query, count]);

  return { photos, failureReason };
}
