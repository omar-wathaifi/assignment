import Link from "next/link";

import { PageHeader } from "@/components/page-header";

export default function GameNotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Game"
        title="This game is not in the catalogue"
        description="There is no game with that address, so it may have been renamed or removed."
      />
      <Link
        href="/"
        className="inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
      >
        Browse all categories
      </Link>
    </>
  );
}
