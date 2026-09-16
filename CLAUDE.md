# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small board-game catalogue: home page → category listing → game detail page. Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4. No database — the catalogue is a plain TypeScript data module (`data/catalogue.ts`). Deploys to Vercel's free tier.

## Commands

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck  # tsc --noEmit
npm test           # Vitest, run once
npm run test:watch # Vitest, watch mode
```

Run a single test file: `npx vitest run tests/format.test.ts`. Run by name: `npx vitest run -t "formatDate"`.

Setup: `cp .env.example .env` before `npm run dev`/`npm run build` (see Unsplash section below — the app runs fine with the key blank).

## Data shape

`data/catalogue.ts` is the single source of truth — two arrays, no database. Never import it directly from a page or component; always go through the read helpers in `lib/catalogue.ts` (`getCategories`, `getCategoryById`, `getGamesByCategory`, `getGameById`, `getAllGames`, `countGamesByCategory`).

```ts
interface Category {
  id: string;          // slug used in the URL: /categories/{id}
  name: string;
  description: string;
  photoQuery: string;   // Unsplash search term for this category's photos
}

interface Game {
  id: string;           // slug used in the URL: /games/{id}
  categoryId: string;   // must match an existing Category.id
  name: string;
  description: string;
  price: number;
  currency: string;     // ISO 4217, e.g. "JOD" — one currency for the whole catalogue
  releaseDate: string;  // ISO 8601 date, e.g. "2017-10-19"
  imageUrl: string;     // local placeholder cover, e.g. "/images/{id}.svg"
}
```

Every category needs at least 4 games. `tests/catalogue.test.ts` enforces uniqueness of ids, that every game's `categoryId` resolves, and that every field renders through the formatters — extend it rather than skip it when the data changes.

## Secrets

Two variables, both server-side only, both listed (blank) in `.env.example` and filled in locally in `.env` (git-ignored — verify with `git check-ignore -v .env .env.example`: the first should print, the second should stay silent):

- `UNSPLASH_ACCESS_KEY` — read only by `lib/unsplash.ts`, called only from `app/api/photos/route.ts` and `lib/photos.ts` (both server-side). Get one at <https://unsplash.com/developers>.
- `CONTEXT7_API_KEY` — used by `.mcp.json` to authenticate the Context7 MCP server (a Claude Code dev tool, not read by the site itself). Get one at <https://context7.com/dashboard>.

Never prefix either with `NEXT_PUBLIC_` — that inlines the value into the client bundle. Any new external API follows the same rule: the key is read in a route handler or a `server-only`-guarded lib module, never in a client component, and the variable is added to `.env.example` blank before it's added to `.env`.

## Architecture

### Data flow: server data, client-fetched grid

The category page (`app/categories/[categoryId]/page.tsx`) is a server component that reads the category directly via `getCategoryById` for the header, then hands off to `components/game-list.tsx` — a **client** component that fetches `GET /api/games?categoryId=...` in the browser. This split exists specifically so the four required list states (loading / empty / error / success) are real, not simulated: loading is a skeleton grid (`components/skeleton-grid.tsx`, never a bare spinner), error has a working retry that refetches, empty explains what to do next. `loading.tsx` / `error.tsx` / `not-found.tsx` siblings on both dynamic routes cover the server-rendering boundary on top of that.

Both dynamic routes set `export const dynamicParams = false` with `generateStaticParams` — the catalogue is fully known at build time, so any other id is a genuine 404, not an on-demand render.

### The Unsplash key never reaches the browser

`lib/unsplash.ts` reads `UNSPLASH_ACCESS_KEY` from `process.env` and is marked with the `server-only` import guard, so importing it from a client component fails the build. It's called from exactly two places:
- `app/api/photos/route.ts` — the only route the browser talks to (via `lib/use-photos.ts`, a client hook used by `game-list.tsx` for the grid's card photos).
- `lib/photos.ts` — used directly by the server-rendered game detail page (`app/games/[gameId]/page.tsx`) to resolve one photo per game, matched by the game's index within its category so a card and its detail page show the same photo.

Never add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` — that prefix would inline the key into the client bundle, defeating the whole point.

Both API routes (`app/api/games`, `app/api/photos`) return one shared envelope, built with the helpers in `lib/api.ts`: success is `{ "data": ... }`, errors are always `{ "error": { "code": "...", "message": "..." } }`. `lib/unsplash.ts` throws a typed `UnsplashError` for each failure mode (missing key, invalid key, timeout via `AbortSignal.timeout` at 5s, generic upstream error); the route handler maps it to the right HTTP status and error code. If the photo fetch fails for any reason, the grid/detail page falls back to the local placeholder SVG covers in `public/images/` — the catalogue itself is never blocked by Unsplash being down or unconfigured.

### House style (shared formatting, not per-page)

- **Dates** render as `15 Sep 2026` via `lib/format.ts::formatDate` — hand-rolled, not `Intl.DateTimeFormat`, because recent ICU renders en-GB September as `Sept`. Never slashes, long month names, or ordinals.
- **Money** renders as `12.50 JOD` via `lib/format.ts::formatMoney` — two decimals, a space, the ISO 4217 code, never a currency symbol.
- **Page headers** always go through `components/page-header.tsx`: uppercase letter-spaced eyebrow → `h1` → one muted sentence. Don't hand-roll this pattern inline on a new page.
- Images always get explicit `width`/`height` and real alt text (or `aria-hidden`/decorative skeletons, never a bare spinner).

Changing either formatter or the header pattern affects every page at once — that's intentional; keep it that way rather than reintroducing per-page formatting.

## Testing

Four Vitest suites in `tests/`, run against `jsdom` with `@testing-library/react` (see `vitest.config.ts` — the `server-only` import is aliased to a no-op there so server modules can be unit-tested):

- `format.test.ts` — house-style date/money rules, including the `Sep`/`Sept` ICU trap.
- `catalogue.test.ts` — data integrity (unique ids, every game's `categoryId` resolves, every category has several games, every stored value renders through the formatters).
- `api-photos.test.ts` — the error envelope for every `/api/photos` failure mode, the 5s abort, and that the access key is sent only to Unsplash (mocks global `fetch`).
- `game-list.test.tsx` — the loading/empty/error/success states of `GameList`, and that retry actually refetches and recovers.

When adding a new API failure mode or list state, extend the matching suite above rather than starting a new one.

## Definition of done

A change under `app/`, `components/`, `lib/`, or `data/` is done only when, in order:

1. `npm run lint`, `npm run typecheck`, and `npm test` pass, and `npm run build` succeeds.
2. The **site-reviewer** subagent (`.claude/agents/site-reviewer.md`) has reviewed the diff against `main` and every BLOCKING finding is resolved.
3. The change has been checked in a real browser via the Playwright MCP server (`.mcp.json`) — not just read back as HTML — on at least the page(s) touched.

Skipping any of these three isn't a shortcut, it's an unfinished change.
