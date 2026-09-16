# Meeple & Co — board game catalogue

A small catalogue website built as a clean vertical slice: a home page, category
listings and game detail pages, backed by a local TypeScript data module rather
than a database.

Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS.
It runs on Node.js 20+ and deploys to Vercel's free tier without changes.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Then open <http://localhost:3000>.

The catalogue works straight away with no configuration — without an Unsplash
key it renders the local placeholder covers in `public/images`.

## The Unsplash API key

Photography is an optional enhancement served through the app's own backend
route, `/api/photos`.

1. Sign in at <https://unsplash.com/developers> and choose **New Application**.
2. Accept the API terms and give the application a name.
3. Copy the **Access Key** (not the Secret Key) from the application page.
4. Paste it into your local `.env`:

   ```env
   UNSPLASH_ACCESS_KEY=your-access-key
   ```

5. Restart `npm run dev` so the server picks it up.

Rules the code enforces:

- **The key never reaches the browser.** It is read only in `lib/unsplash.ts`,
  which is imported exclusively by the server-side route handler at
  `app/api/photos/route.ts`. The module is marked `server-only`, so importing it
  from a client component fails the build.
- **Never use `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`** — that prefix would inline the
  key into the client bundle.
- **Never commit the key.** `.env` and `.env*.local` are git-ignored; only
  `.env.example`, which holds an empty value, is tracked.

In production, set `UNSPLASH_ACCESS_KEY` in the Vercel project's **Settings →
Environment Variables** instead of shipping a file.

## Commands

```bash
npm run dev        # start the development server on http://localhost:3000
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck  # tsc --noEmit
npm test           # Vitest (run once); npm run test:watch to watch
npm run build      # production build
npm start          # serve the production build
```

## How it works

### The catalogue

`data/catalogue.ts` holds three categories (Strategy, Family, Party) and twelve
games. Every game has this shape:

```ts
{
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  releaseDate: string; // ISO 8601, e.g. "2017-10-19"
  imageUrl: string;
}
```

Read it through the helpers in `lib/catalogue.ts` rather than importing the data
module directly.

### The four list states

The category page server-renders its header and hands the grid to
`components/game-list.tsx`, a client component that loads the games from
`/api/games`. That keeps all four states real:

| State   | What you see                                                            |
| ------- | ----------------------------------------------------------------------- |
| Loading | Skeleton cards matching the real layout, plus a screen-reader status     |
| Success | The grid of game cards                                                   |
| Empty   | An explanation and a link back to the categories                         |
| Error   | What failed, plus a **Try loading again** button that refetches          |

The route also has `loading.tsx`, `error.tsx` and `not-found.tsx` for the server
rendering boundary, and the detail page has the same three.

To see the empty state in the browser, remove one category's games from
`data/catalogue.ts`; it is also covered by `tests/game-list.test.tsx`.

### The API routes

Both routes answer with the same envelope. Errors are always:

```json
{ "error": { "code": "SOME_ERROR_CODE", "message": "Human readable message" } }
```

and successes are always `{ "data": ... }`.

- `GET /api/games?categoryId=strategy` — the catalogue for one category.
  Errors: `MISSING_CATEGORY_ID` (400), `CATEGORY_NOT_FOUND` (404).
- `GET /api/photos?query=board%20games&count=6` — proxies an Unsplash search
  with a **five-second timeout** (`AbortSignal.timeout`). Errors:
  `MISSING_QUERY` / `INVALID_COUNT` (400), `MISSING_API_KEY` (503),
  `INVALID_API_KEY` / `UPSTREAM_ERROR` / `UPSTREAM_UNAVAILABLE` (502),
  `UPSTREAM_TIMEOUT` (504), `INTERNAL_ERROR` (500).

If the photo request fails for any reason, the grid keeps the local placeholder
covers and shows a short notice, so the catalogue is never blocked by Unsplash.

### House style

Shared conventions live in one place so they stay consistent:

- **Dates** — `lib/format.ts` renders `15 Sep 2026`. Never `15/09/2026`,
  `September 15, 2026` or ordinals. (`Intl` is deliberately not used: recent ICU
  versions render en-GB September as `Sept`.)
- **Money** — `lib/format.ts` renders `12.50 EUR`: two decimals, a space, the
  ISO 4217 code. Never `€12.50`.
- **Page headers** — `components/page-header.tsx` renders an uppercase,
  letter-spaced eyebrow, then the `h1`, then one muted sentence.
- **Images** — every image has explicit `width` and `height` and meaningful alt
  text; decorative skeletons are `aria-hidden` instead.

## Project structure

```text
app/
  layout.tsx                     site shell: skip link, header, main, footer
  page.tsx                       home page
  not-found.tsx
  categories/[categoryId]/       page + loading + error + not-found
  games/[gameId]/                page + loading + error + not-found
  api/
    games/route.ts               catalogue read for the browser
    photos/route.ts              Unsplash proxy (holds the secret key)
components/                      page header, cards, list, empty/error/skeleton states
data/catalogue.ts                the catalogue itself
lib/
  api.ts                         shared success and error envelopes
  catalogue.ts                   read helpers
  format.ts                      house-style date and money formatting
  photo.ts                       photo shape shared by server and client
  unsplash.ts                    server-only Unsplash client (5s timeout)
  use-photos.ts                  client hook for /api/photos
public/images/                   local placeholder covers (SVG)
tests/                           Vitest suites
```

## Testing

`npm test` runs four suites with Vitest and Testing Library:

- `format.test.ts` — the house-style date and money rules, including the
  `Sep`/`Sept` trap and the no-symbol rule for money.
- `catalogue.test.ts` — data integrity: unique ids, every game resolves to a
  real category, every category has several games, every stored value renders.
- `api-photos.test.ts` — the error envelope for each failure mode, the
  five-second abort, and that the access key is sent only to Unsplash.
- `game-list.test.tsx` — the loading, success, empty and error states, and that
  the retry button recovers.

## Deploying to Vercel

Import the repository, keep the detected Next.js defaults, and add
`UNSPLASH_ACCESS_KEY` under Settings → Environment Variables. No database or
other service is required.
