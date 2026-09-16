import Link from "next/link";

/**
 * Empty state: says what is missing and what the reader can do next.
 */
export function EmptyState({
  title,
  description,
  actionHref = "/",
  actionLabel = "Browse all categories",
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section
      aria-labelledby="empty-state-title"
      className="rounded-xl border border-dashed border-line bg-surface p-8 text-center"
    >
      <h2 id="empty-state-title" className="text-lg font-semibold text-ink">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
      >
        {actionLabel}
      </Link>
    </section>
  );
}
