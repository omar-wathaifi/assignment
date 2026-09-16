// Copy-paste starting point for a new page's header. Fill in the three
// props and keep it as the first thing the page renders — including on
// error.tsx and not-found.tsx files, which need the header too.
//
// - eyebrow: short, uppercase section name (the component uppercases it for
//   you — pass normal case, e.g. "Category", not "CATEGORY").
// - title: the page's one h1. Don't add a second heading above this.
// - description: exactly one muted sentence. Not a paragraph, not a list.

import { PageHeader } from "@/components/page-header";

<PageHeader
  eyebrow="Section name"
  title="Page title"
  description="One muted sentence describing what this page shows."
/>;
