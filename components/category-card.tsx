import Link from "next/link";

import { countGamesByCategory, type Category } from "@/lib/catalogue";

export function CategoryCard({ category }: { category: Category }) {
  const gameCount = countGamesByCategory(category.id);

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-6 shadow-sm transition hover:shadow-md focus-within:shadow-md">
      <h3 className="text-xl font-semibold tracking-tight text-ink">
        <Link
          href={`/categories/${category.id}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
        >
          {category.name}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{category.description}</p>
      <p className="mt-4 text-sm font-medium text-brand">
        {gameCount} {gameCount === 1 ? "game" : "games"} &rarr;
      </p>
    </article>
  );
}
