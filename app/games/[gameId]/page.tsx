import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { getAllGames, getCategoryById, getGameById } from "@/lib/catalogue";
import { formatDate, formatMoney } from "@/lib/format";

const DETAIL_IMAGE_WIDTH = 960;
const DETAIL_IMAGE_HEIGHT = 600;

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

// The catalogue is fully known at build time, so any other id is a genuine 404
// rather than a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGames().map((game) => ({ gameId: game.id }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    return { title: "Game not found" };
  }

  return { title: game.name, description: game.description.slice(0, 160) };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    notFound();
  }

  const category = getCategoryById(game.categoryId);

  return (
    <>
      <PageHeader
        eyebrow={category ? category.name : "Game"}
        title={game.name}
        description={`Released ${formatDate(game.releaseDate)} and listed at ${formatMoney(game.price, game.currency)}.`}
      />

      <article className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <Image
          src={game.imageUrl}
          alt={`Placeholder cover art for ${game.name}`}
          width={DETAIL_IMAGE_WIDTH}
          height={DETAIL_IMAGE_HEIGHT}
          sizes="(min-width: 1024px) 600px, 92vw"
          priority
          className="w-full rounded-xl border border-line bg-surface object-cover"
        />

        <div className="flex flex-col gap-6">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-lg font-semibold text-ink">
              About this game
            </h2>
            <p className="mt-2 text-base leading-relaxed text-muted">{game.description}</p>
          </section>

          <section aria-labelledby="details-heading">
            <h2 id="details-heading" className="text-lg font-semibold text-ink">
              Details
            </h2>
            <dl className="mt-3 divide-y divide-line border-y border-line text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Price</dt>
                <dd className="font-semibold text-ink">
                  {formatMoney(game.price, game.currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Currency</dt>
                <dd className="text-ink">{game.currency}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Released</dt>
                <dd className="text-ink">{formatDate(game.releaseDate)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Category</dt>
                <dd className="text-ink">{category ? category.name : "Uncategorised"}</dd>
              </div>
            </dl>
          </section>

          {category ? (
            <Link
              href={`/categories/${category.id}`}
              className="inline-block self-start rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
            >
              &larr; Back to {category.name} games
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-block self-start rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
            >
              &larr; Back to the catalogue
            </Link>
          )}
        </div>
      </article>
    </>
  );
}
