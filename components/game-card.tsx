import Image from "next/image";
import Link from "next/link";

import type { Game } from "@/lib/catalogue";
import { formatDate, formatMoney } from "@/lib/format";

export const CARD_IMAGE_WIDTH = 480;
export const CARD_IMAGE_HEIGHT = 300;

export interface CardPhoto {
  url: string;
  alt: string;
}

export function GameCard({ game, photo }: { game: Game; photo?: CardPhoto | null }) {
  const imageSrc = photo?.url ?? game.imageUrl;
  const imageAlt = photo
    ? `${game.name}: ${photo.alt}`
    : `Placeholder cover art for ${game.name}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition hover:shadow-md focus-within:shadow-md">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={CARD_IMAGE_WIDTH}
        height={CARD_IMAGE_HEIGHT}
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 92vw"
        className="h-44 w-full border-b border-line object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-snug text-ink">
          <Link
            href={`/games/${game.id}`}
            className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
          >
            {game.name}
          </Link>
        </h3>
        <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <div>
            <dt className="sr-only">Price</dt>
            <dd className="font-semibold text-ink">{formatMoney(game.price, game.currency)}</dd>
          </div>
          <div>
            <dt className="sr-only">Release date</dt>
            <dd className="text-muted">{formatDate(game.releaseDate)}</dd>
          </div>
        </dl>
        <p aria-hidden="true" className="mt-auto pt-2 text-sm font-medium text-brand">
          View details &rarr;
        </p>
      </div>
    </article>
  );
}
