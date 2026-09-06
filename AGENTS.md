# serhiykucherenko.dev — agent rules

Personal site of Serhiy Kucherenko. Astro + MDX, plain CSS. These rules are
canonical; `CLAUDE.md` just points here.

## Deploy — no staging exists

Push to `main` = live. A Git-connected Cloudflare Worker (`serhiykucherenko-dev`,
`wrangler.jsonc`) builds (`npm run build`) and deploys on every push.
**Always run `npm run build` locally before committing.** A broken push breaks
production.

`worker/index.js` intercepts `/` for terminal clients (curl/wget/httpie ANSI
business card); everything else is the static build.

## Content model

Articles are LINK-OUTS — no article bodies on this site. The registry is
`src/data/articles.json` — the SINGLE SOURCE OF TRUTH for every published and
pending piece `{status, date, title, metric, where, url, also[], piece, notes}`.
`metric` is the one real number that carries the piece. `src/data/articles.ts`
only reads the JSON (published rows, newest first); never add entries there.
There is no `src/content/` and no hosted blog posts; `src/pages/blog/index.astro`
renders the list, `src/pages/rss.xml.js` the feed.

`npm run build` runs `scripts/check-articles.mjs` first (prebuild) — bad dates,
missing fields or duplicate URLs fail the build, locally and on Cloudflare.

Other curated data, all hand-edited TypeScript:
- `src/data/shiplog.ts` — real dated milestones that are NOT articles (deploys,
  launches). Merged with articles on /blog. No invented metrics, ever.
- `src/data/lab.ts` — open questions being tested for real (/lab)
- `src/data/decisions.ts` — decision records (/decisions)
- `src/data/architecture.ts` — systems pages (/systems)

## Sync rule

One edit, one command:
1. Edit `src/data/articles.json` (flip `pending` → `published`, fill url/also/metric).
2. Run `npm run sync:shop` — validates the JSON and re-renders
   `C:\repos\article-writer\PUBLISHED.md` from it (PUBLISHED.md is GENERATED;
   never edit it by hand). Commit both repos.

The piece's `FINAL.md` is a working document, not a record — it may note the
publish, but it is never a sync target and never wins a disagreement.

Dates come from the platform byline (the LinkedIn article page shows the real
publish date), not from memory or drafts.

## Owner rules

- Nothing publishes without owner sign-off. Agent prepares; owner clicks.
- Facts over recollection: if owner memory and repo disagree, the repo (or the
  live platform) wins — and tell the owner.
- No credentials in any repo file, ever.
- `TODO-SERHIY.md` tracks owner-only pending items. Keep it current; resolve or
  drop items rather than working around them.

## Development

Dev server in background mode: `astro dev --background` (manage with
`astro dev stop` / `status` / `logs`). Docs: https://docs.astro.build

## Related

- Article shop: `C:\repos\article-writer` (pieces, briefs, PUBLISHED.md — not a
  git repo)
- Source project linked from the site: https://github.com/KucherenkoSerhiy/payments-rag,
  live demo https://rag.serhiykucherenko.dev
