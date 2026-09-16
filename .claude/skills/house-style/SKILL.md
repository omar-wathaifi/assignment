---
name: house-style
description: This site's non-default conventions for page headers, list states, dates, money, external calls, and images. Use when creating or editing any page under app/, any list-rendering component, any formatted date or price, any route handler that calls an external API, or any image — and when reviewing a diff for style compliance.
---

# House style

Six rules, none of them the framework default, all of them non-negotiable. If a page comes out wrong, the fix is this skill (or the shared code it points to), not a one-off patch on that page.

Full detail and file pointers: `references/house-style.md`. Copy-paste starting point for a new page's header: `assets/page-header-template.tsx`.

## The six rules

1. **Page header.** Every page — including error and not-found pages — opens with the same block: an uppercase, letter-spaced eyebrow naming the section, an `h1`, one muted sentence underneath. Never hand-roll this; use `components/page-header.tsx`.
2. **Four states.** Every list has loading, empty, error, and success. Loading is never a bare spinner. Empty says what to do next. Error says what failed and offers a retry that actually retries.
3. **Dates** render as `15 Sep 2026` — day, three-letter month, year. No slashes, no full month names, no ordinals. Times, if any, are 24-hour.
4. **Money** renders as `12.50 JOD` — two decimals, a space, the ISO 4217 code. Never a currency symbol.
5. **External calls** happen only inside route handlers (`app/api/**/route.ts`) or a `server-only`-guarded lib module, with a timeout, and every failure returns `{ "error": { "code": "...", "message": "..." } }`.
6. **Images** always have alt text (`alt=""` if purely decorative) and explicit `width`/`height` — never a raw external URL rendered with neither.

Read `references/house-style.md` before implementing any of these from scratch — the shared helper almost certainly already exists.
