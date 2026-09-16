"use client";

/**
 * Error state: explains what failed and offers a retry.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Try loading again",
}: {
  title: string;
  description: string;
  onRetry: () => void;
  retryLabel?: string;
}) {
  return (
    <section
      aria-labelledby="error-state-title"
      className="rounded-xl border border-line bg-surface p-8 text-center"
      role="alert"
    >
      <h2 id="error-state-title" className="text-lg font-semibold text-danger">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
      >
        {retryLabel}
      </button>
    </section>
  );
}
