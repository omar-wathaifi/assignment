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
