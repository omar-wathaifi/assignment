import Link from "next/link";

import { PageHeader } from "@/components/page-header";

export default function CategoryNotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Category"
        title="This category does not exist"
        description="There is no category with that address in the catalogue."
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
