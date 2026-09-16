# House style — reference

Detail and file pointers for each of the six rules in `SKILL.md`.

## 1. Page header

Every page — home, category, detail, `loading.tsx`, `error.tsx`, `not-found.tsx` — renders `<PageHeader eyebrow="..." title="..." description="..." />` from `components/page-header.tsx` as the first thing in its returned JSX. It renders, in order: an uppercase, letter-spaced eyebrow (`text-xs font-semibold uppercase tracking-[0.2em]`), the `h1`, then one muted sentence.

Do not add a second `h1` on the page. Do not skip the header on an error or not-found page — those need it too, with an eyebrow that still names the section (e.g. `"Category"`, not `"Error"`).

Starting point: `assets/page-header-template.tsx`.

## 2. Four states

Any component that fetches or filters a list (the pattern is `components/game-list.tsx`) must render all four states, using the shared components:

- **Loading** — `components/skeleton-grid.tsx`, or a bespoke skeleton in the same shape as the loaded content. Never a spinner alone. Pair it with a `role="status"` element carrying the real sr-only text (e.g. "Loading games…") for screen readers.
- **Empty** — `components/empty-state.tsx`. The description must tell the reader what to do next (try another category, adjust a filter, etc.), not just state that nothing is there.
- **Error** — `components/error-state.tsx`. The description must say what failed, and the retry button must actually re-run the failed request (see `game-list.tsx`'s `attempt` counter pattern), not just show a static message.
- **Success** — the real content.

Route-level `loading.tsx` / `error.tsx` / `not-found.tsx` files cover the server-rendering boundary (a hard navigation, a thrown error, a `notFound()` call) in addition to this in-component state machine — both exist because they cover different failure points.

## 3. Dates

Always `lib/format.ts::formatDate(isoDate)`, producing `15 Sep 2026`. Never `toLocaleDateString`, `Intl.DateTimeFormat`, or a hand-rolled format elsewhere — `Intl` in particular is deliberately avoided here because recent ICU renders en-GB September as `Sept`, which this house style forbids. If a new date needs formatting, import this function; don't add a second date formatter.

## 4. Money

Always `lib/format.ts::formatMoney(amount, currency)`, producing `12.50 JOD` (two decimals, a space, the ISO 4217 code, taken from the data — never hardcoded). Never a currency symbol (`$`, `€`, `JD`) and never `toLocaleString("en", { style: "currency" })`, which produces a symbol.

The catalogue is single-currency (`JOD`) by convention, enforced by a test in `tests/catalogue.test.ts` that asserts every game shares one currency. If a change intentionally introduces multiple currencies, update that test deliberately — don't let it happen as a side effect of adding one item.

## 5. External calls

Every external HTTP call lives in a route handler under `app/api/**/route.ts`, or in a lib module imported only by one (see `lib/unsplash.ts`, guarded with `import "server-only"`). Never call an external API from a client component or a page's client-side code directly — the API key would have to be exposed to do that, which rule 5 and the Secrets section of `CLAUDE.md` both forbid.

Every such call sets a timeout — this codebase uses `AbortSignal.timeout(5000)` (see `lib/unsplash.ts`) — and every failure path returns the shared envelope from `lib/api.ts::errorResponse(code, message, status)`:

```json
{ "error": { "code": "SOME_ERROR_CODE", "message": "Human readable message" } }
```

A success response is `{ "data": ... }` via `lib/api.ts::successResponse`. Don't invent a second envelope shape for a new route.

## 6. Images

Every `<Image>` (or `<img>`) needs:
- `width` and `height` set explicitly (never omitted, never `fill` without a documented reason).
- Real alt text describing the image's content (e.g. `"${game.name}: ${photo.alt}"`), or `alt=""` if the image is purely decorative (see the skeleton grid, which is `aria-hidden` instead of using an `<img>` at all).

A raw external URL (Unsplash or otherwise) is never rendered without both dimensions — see `next.config.ts`'s `images.remotePatterns` restricting external sources to `images.unsplash.com`, and the fallback to a local placeholder SVG in `public/images/` whenever the external photo isn't available.
