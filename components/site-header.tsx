import Link from "next/link";

import { getCategories } from "@/lib/catalogue";

export function SiteHeader() {
  const categories = getCategories();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-ink hover:text-brand"
        >
          Meeple &amp; Co
        </Link>
        <nav aria-label="Catalogue categories">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.id}`}
                  className="text-muted hover:text-brand"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
