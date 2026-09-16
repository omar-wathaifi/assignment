export default function LoadingGame() {
  return (
    <div className="animate-pulse">
      <p className="sr-only" role="status">
        Loading game details…
      </p>
      <div aria-hidden="true">
        <div className="h-3 w-24 rounded bg-line" />
        <div className="mt-4 h-9 w-72 rounded bg-line" />
        <div className="mt-4 h-4 w-full max-w-xl rounded bg-line" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="h-72 w-full rounded-xl bg-line" />
          <div className="space-y-3">
            <div className="h-5 w-40 rounded bg-line" />
            <div className="h-4 w-full rounded bg-line" />
            <div className="h-4 w-11/12 rounded bg-line" />
            <div className="h-4 w-2/3 rounded bg-line" />
          </div>
        </div>
      </div>
    </div>
  );
}
