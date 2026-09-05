# serhiykucherenko.dev

Personal site. Astro + MDX, plain CSS, no frameworks. Deployed as a Cloudflare Worker.

## Content model

There are no hosted blog posts. Articles live where they were published (LinkedIn,
dev.to, Hashnode); the site only lists and links out to them.

- **Publish an article** → add one entry to `src/data/articles.ts`
  (`{date, title, metric, where, url, also[]}`). `metric` is the one real number
  that carries the piece. See the sync rule in `AGENTS.md` — a publish updates
  three places or none.
- **Ship something real** (a deploy, a launch, a milestone that isn't an article)
  → add an entry to `src/data/shiplog.ts`. No invented metrics.
- Other curated data: `src/data/lab.ts` (open questions), `decisions.ts` (ADRs),
  `architecture.ts` (systems pages).

## Develop locally

```
npm install
npm run dev       # localhost:4321
npm run build     # output in dist/  — ALWAYS run this before pushing
```

## Deploy

Push to `main` = live. A Git-connected Cloudflare Worker (`serhiykucherenko-dev`,
config in `wrangler.jsonc`) runs `npm run build` and deploys automatically.
There is no staging — a broken push breaks production, so build locally first.

`worker/index.js` serves an ANSI business card to curl/wget/httpie on `/`;
browsers get the static site from `dist/`.
