import Link from "next/link";

import { PageHeader } from "@/components/page-header";

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Not found"
        title="This page does not exist"
        description="The link may be out of date, or the page may have been removed from the catalogue."
      />
      <Link
        href="/"
        className="inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
      >
        Back to the catalogue
      </Link>
    </>
  );
}
