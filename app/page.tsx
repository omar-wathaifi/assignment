import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/page-header";
import { getAllGames, getCategories } from "@/lib/catalogue";

export default function HomePage() {
  const categories = getCategories();
  const gameCount = getAllGames().length;

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Board games worth clearing the table for"
        description={`A small, hand-picked catalogue of ${gameCount} games across ${categories.length} categories, with prices and release dates.`}
      />

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-xl font-semibold tracking-tight text-ink">
          Categories
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Pick a category to see every game in it, or open a game for the full description.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
