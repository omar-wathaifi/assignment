import { SkeletonGrid } from "@/components/skeleton-grid";

export default function LoadingCategory() {
  return (
    <>
      <div className="mb-10 animate-pulse" aria-hidden="true">
        <div className="h-3 w-24 rounded bg-line" />
        <div className="mt-4 h-9 w-64 rounded bg-line" />
        <div className="mt-4 h-4 w-full max-w-2xl rounded bg-line" />
      </div>
      <SkeletonGrid />
    </>
  );
}
