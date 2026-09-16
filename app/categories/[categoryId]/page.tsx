import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GameList } from "@/components/game-list";
import { PageHeader } from "@/components/page-header";
import { getCategories, getCategoryById } from "@/lib/catalogue";

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

// The catalogue is fully known at build time, so any other id is a genuine 404
// rather than a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((category) => ({ categoryId: category.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = getCategoryById(categoryId);

  if (!category) {
    return { title: "Category not found" };
  }

  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageHeader eyebrow="Category" title={category.name} description={category.description} />
      <GameList
        categoryId={category.id}
        categoryName={category.name}
        photoQuery={category.photoQuery}
      />
    </>
  );
}
