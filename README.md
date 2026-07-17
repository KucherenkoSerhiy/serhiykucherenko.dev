# serhiykucherenko.dev

Personal site. Astro, MDX, plain CSS. Deployed on Cloudflare Pages.

## Add a blog post

1. Create `src/content/blog/my-post.mdx` with this frontmatter:

   ```yaml
   ---
   title: "Post title"
   description: "One-line summary, shows in lists and meta tags."
   pubDate: 2026-07-24
   tags: [rag, evals]
   canonicalUrl: https://www.linkedin.com/pulse/...   # only for LinkedIn-first posts
   ---
   ```

2. Write the body in Markdown below the frontmatter.
3. Commit and push. Cloudflare Pages builds and deploys automatically.

The filename becomes the URL: `my-post.mdx` → `/blog/my-post/`. Add `draft: true` to keep a post out of the build.

## Develop locally

```
npm install
npm run dev       # localhost:4321
npm run build     # output in dist/
```

## Deploy

Cloudflare Pages, connected to this repo. Build command `npm run build`, output directory `dist`. Custom domain: serhiykucherenko.dev.

## Pending TODOs

- Set the real LinkedIn profile URL in `src/consts.ts`.
- Add `canonicalUrl` to `src/content/blog/localhost-trap.mdx` once the LinkedIn article is live.
- Add the payments-rag live demo URL in `src/pages/projects.astro` when it deploys.
