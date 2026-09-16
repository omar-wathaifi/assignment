---
description: Add a new board-game category with at least four plausible games, placeholder covers, and a typecheck — stops before committing.
argument-hint: <category name>
allowed-tools: Read, Edit, Write, Bash(npm run typecheck:*), Bash(git status:*), Bash(git diff:*)
---

Add the category "$ARGUMENTS" to this catalogue.

## 1. Refuse on a dirty tree

Run `git status --porcelain`. If it prints anything, stop immediately and tell the user to commit or stash first — do not touch any file. This command only ever runs against a clean working tree, the same guard the lifecycle commands use.

## 2. Add the category

Read `data/catalogue.ts` and `lib/catalogue.ts` (`Category`/`Game` types) first. Derive a kebab-case `id` from "$ARGUMENTS" (e.g. "Board games" → `board-games`). If a category with that id (or an equivalent name) already exists, stop and say so instead of creating a duplicate.

Append one `Category` to the `categories` array: `id`, `name` (as given), a one-sentence `description` in the same voice as the existing categories (what kind of game, who it's for — not marketing copy), and a `photoQuery` (a short Unsplash search term for this kind of game).

## 3. Add at least four games

Append at least four `Game` entries to the `games` array, each with every required field and following the existing house style exactly:

- `id`: kebab-case slug of the game's name.
- `categoryId`: the new category's id.
- `name`, `description`: real, plausible board games that actually fit this category (not filler text) — a two-to-three sentence description in the same voice as existing entries.
- `price`: a realistic number.
- `currency`: `"JOD"` — the same currency every other game in the catalogue uses. Do not introduce a second currency.
- `releaseDate`: real ISO `YYYY-MM-DD`.
- `imageUrl`: `/images/{id}.svg`.

## 4. Generate placeholder covers

For each new game, create `public/images/{id}.svg`: same 480×300 gradient-plus-label pattern as the existing files in that directory (read one first, e.g. `public/images/azul.svg`, to match it exactly) — a category-appropriate two-stop gradient not already used by another category, the category name as a small uppercase label, and the game's name as the large title. This is what satisfies the house style's image rule at the data layer; the components already handle alt text and explicit dimensions for whatever file is at this path.

## 5. Verify, then stop

Run `npm run typecheck`. Fix anything it flags in the files you just wrote. Then run `git diff` and show it in full — that diff is the output of this command. Do not run `git add` or `git commit`, and do not modify any file beyond `data/catalogue.ts` and the new files under `public/images/`. Leave the diff for the user to review and commit themselves.
