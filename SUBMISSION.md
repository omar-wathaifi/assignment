# Submission

- Site: https://assignment-phi-black.vercel.app/
- Preview deployment from a feature branch: https://github.com/omar-wathaifi/assignment
- Stack: Next.js 15.5.25, React 19.1.0, TypeScript, Tailwind CSS v4
- External service and the variable that holds its key: Unsplash API / `UNSPLASH_ACCESS_KEY` (read only in `lib/unsplash.ts`, called from `app/api/photos/route.ts` and `lib/photos.ts`)

## The artifacts

- Scaffold prompt: not captured as `_prompts/scaffold-prompt.md` — the scaffold was built directly from a long-form spec pasted into chat (commits `562bd42`, `30b3bf5`), not from a saved prompt file. Gap, not done.
- Rule file: `CLAUDE.md`, 106 lines. Three rules that earned their place, each from a real incident in this repo: (1) dates are hand-rolled in `lib/format.ts` instead of `Intl.DateTimeFormat`, because recent ICU renders en-GB September as `Sept`; (2) both dynamic routes set `dynamicParams = false`, because unknown category/game ids returned 200 instead of 404 until that was added; (3) the catalogue is single-currency (`JOD`), enforced by a `tests/catalogue.test.ts` assertion, after every game was priced in `EUR` until a mid-project currency change.
- MCP: project-scoped `.mcp.json` (Context7 over HTTP, Playwright over stdio). `claude mcp list` output, unredacted:

  ```
  context7: https://mcp.context7.com/mcp (HTTP) - ⏸ Pending approval (run `claude` to approve)
  playwright: npx -y @playwright/mcp@latest - ⏸ Pending approval (run `claude` to approve)
  ```

  No "missing variable" warning on Context7 once `CONTEXT7_API_KEY` is set in `.env` (verified: the warning appears when the variable is unset and disappears once it's exported). Both servers show "Pending approval" rather than "Connected" — that's Claude Code's one-time per-project consent gate for new `.mcp.json` servers; it clears the next time `claude` is run interactively in this directory and the approval prompt is accepted. Not yet done from an interactive session.
- Skill: `.claude/skills/house-style/` (SKILL.md + references/house-style.md + assets/page-header-template.tsx), commit `dcb60be`. The transcript line where it fired unprompted during Feature B: not available — Feature B hasn't been built yet.
- Reviewer: `.claude/agents/site-reviewer.md`, commit `b8871a5`. Three rules added beyond the starter, each with its incident (see the rule file bullet above — same three incidents, phrased as review checks): the grid/detail page photo divergence, the 200-instead-of-404 gap, and the EUR→JOD sweep.
- `/add-category`: `.claude/commands/add-category.md`, commit `91fb75c`. Two commits it produced: `8d92e37` (add category Cooperative) and `660d730` (add category Abstract) — each ran the refuse-on-dirty-tree check, typecheck, and full test suite before being committed, on top of the scaffold's original three categories.

## The lifecycle

- Feature A: not started.
- Feature B: not started.
- Lifecycle commands (`create-feature-spec`, `create-feature-branch`, `create-implementation-plan`): not added — no `lifecycle-commands.zip` URL or TaskApp scaffold path was available to copy them from.
- Deviation: n/a yet — nothing has gone through the lifecycle.

## What went wrong

- The game detail page kept rendering its placeholder cover after a real Unsplash key was added, even though the category grid already showed live photos for the same games — the detail page had never been wired to call the photo lookup at all. Fixed by adding `lib/photos.ts`, called directly from `app/games/[gameId]/page.tsx`.
- `/categories/{unknown-id}` and `/games/{unknown-id}` returned HTTP 200 with a rendered "not found" page instead of a real 404, because `generateStaticParams` alone doesn't reject other ids. Fixed by adding `export const dynamicParams = false` to both dynamic routes.
- Every game was priced in `EUR` until partway through, when the catalogue was switched to `JOD` — a catalogue-wide field change that only works if it touches every item. Fixed in that commit and now guarded by a `tests/catalogue.test.ts` assertion that every game shares one currency.

## Secrets check

- `git check-ignore -v .env .env.example` →
  ```
  .gitignore:34:.env	.env
  ```
  (only `.env` printed; `.env.example` produced no output, confirming it isn't ignored)
- History scanned two ways: `git log -p | grep -i key` (every hit is a variable name, an error code, a `key={...}` React prop, or `package-lock.json` dependency noise — no literal value); and a direct `grep -rn` for both actual secret values (`UNSPLASH_ACCESS_KEY`'s and `CONTEXT7_API_KEY`'s literal contents) across every tracked and working-tree file except `.env` itself — zero matches.
- No key has ever been committed.