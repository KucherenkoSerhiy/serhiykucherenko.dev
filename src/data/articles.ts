// Articles live where they were published. The site lists them and links out.
// DO NOT add entries here — edit `articles.json` (the single source of truth).
// `npm run build` validates the JSON; `npm run sync:shop` re-renders the shop's
// PUBLISHED.md from the same file.
import data from './articles.json';

export type Article = {
  date: string; // ISO, publication date (from the platform byline)
  title: string;
  metric: string; // the one real number that carries the piece
  where: string; // platform label shown next to the primary link
  url: string;
  // Same piece, re-posted elsewhere. Canonical stays with `url`.
  also?: { where: string; url: string }[];
};

// Only published pieces reach the site; pending rows exist for the registry.
export const articles: Article[] = data.articles
  .filter((a) => a.status === 'published')
  .map(({ date, title, metric, where, url, also }) => ({ date, title, metric, where, url, also }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));
