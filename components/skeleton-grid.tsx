/**
 * Loading state for a grid of games: placeholder cards that match the real
 * layout, rather than a bare spinner.
 */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div>
      <p className="sr-only" role="status">
        Loading games…
      </p>
      <ul
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index}
            className="animate-pulse overflow-hidden rounded-xl border border-line bg-surface shadow-sm"
          >
            <div className="h-44 w-full border-b border-line bg-line" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-line" />
              <div className="h-4 w-1/2 rounded bg-line" />
              <div className="h-4 w-1/3 rounded bg-line" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
