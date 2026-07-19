# Waiting on Serhiy

Everything below needs your accounts, your face, or your judgment. Each item says exactly what to do and what unblocks. Do them in any order, on any energy level; none is urgent-urgent.

## ~~1. Connect Cloudflare~~ DONE 2026-07-19

Live at https://serhiykucherenko.dev (+ www). Worker `serhiykucherenko-dev`, Git-connected:
every push to `main` builds (`npm run build`) and deploys (`npx wrangler deploy`,
config in `wrangler.jsonc`). Production Lighthouse: 100/100/100/100.

## 2. LinkedIn canonical URL for article 01 (~1 min, unblocks: correct SEO for the first post)

Article published on LinkedIn → copy its URL → paste it to Fable (or put it yourself in
`src/content/blog/localhost-trap.mdx`, frontmatter line `canonicalUrl:`).

## 3. Real LinkedIn profile URL (~1 min)

`src/consts.ts` has a guessed `LINKEDIN_URL`. Send the real one to Fable or edit the file.

## 4. Portrait photo (~when you have one you like)

Drop the file to Fable or save as `public/portrait.jpg` (square, ≥400px). The /hire page
has a commented slot ready; uncommenting is a 10-second job.

## 5. Enable comments (giscus) (~5 min, unblocks: comments under articles)

1. GitHub repo → Settings → General → Features → check "Discussions".
2. Install the giscus app: github.com/apps/giscus → only for `serhiykucherenko.dev` repo.
3. Open giscus.app, enter the repo, pick category "Announcements", copy the values of
   `data-repo-id` and `data-category-id`.
4. Paste both values to Fable. The Comments component is already wired in, dormant, and
   flips on with those two IDs.

## 6. payments-rag live demo URL (other Fable thread, unblocks: /lab "run demo" link)

When the Fly.io deploy from the other thread is live, paste the URL to Fable → it goes
into /lab and /projects.

---

Removed from this list only when done. Fable keeps this file current.
