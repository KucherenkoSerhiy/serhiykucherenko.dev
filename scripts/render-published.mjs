// Renders the shop's PUBLISHED.md from src/data/articles.json (the single
// source of truth). Local-only: `npm run sync:shop`. Never runs in CI.
// Target path: PUBLISHED_MD env var, else ../article-writer/PUBLISHED.md.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = new URL('../src/data/articles.json', import.meta.url);
const { articles } = JSON.parse(readFileSync(src, 'utf8'));
const out = process.env.PUBLISHED_MD ?? resolve(process.cwd(), '..', 'article-writer', 'PUBLISHED.md');

const byDate = (a, b) => (a.date < b.date ? 1 : -1);
const link = (u) => (u ? `[link](${u})` : '');
const mirror = (a, where) => link((a.also ?? []).find((m) => m.where === where)?.url);
const cell = (s) => (s ?? '').replace(/\|/g, '\|');

const published = articles.filter((a) => a.status === 'published').sort(byDate);
const pending = articles.filter((a) => a.status === 'pending').sort((a, b) => (a.date < b.date ? -1 : 1));

const lines = [
  '# Published articles — registry',
  '',
  '<!-- GENERATED from C:/repos/serhiykucherenko.dev/src/data/articles.json by scripts/render-published.mjs.',
  '     Do not edit by hand: edit the JSON, then run `npm run sync:shop` in the site repo. -->',
  '',
  'One row per piece, newest first. The JSON in the site repo is the single source of truth;',
  'this file and the site\'s /blog are both rendered from it. Dates come from the platform byline.',
  '',
  '| Date | Title | Piece | LinkedIn | dev.to | Hashnode | Notes |',
  '|---|---|---|---|---|---|---|',
  ...published.map((a) =>
    `| ${a.date} | ${cell(a.title)} | ${cell(a.piece) || '—'} | ${link(a.url)} | ${mirror(a, 'dev.to')} | ${mirror(a, 'hashnode')} | ${cell(a.notes)} |`
  ),
  '',
  '## Pending',
  '',
  '| Target date | Title | Piece | Status |',
  '|---|---|---|---|',
  ...(pending.length
    ? pending.map((a) => `| ${a.date} | ${cell(a.title)} | ${cell(a.piece) || '—'} | ${cell(a.notes)} |`)
    : ['| — | nothing scheduled | | |']),
  '',
];

writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`wrote ${out} — ${published.length} published, ${pending.length} pending`);
