// Validates src/data/articles.json. Runs as `prebuild`, so a bad registry
// fails the Cloudflare build instead of shipping a broken /blog or RSS feed.
import { readFileSync } from 'node:fs';

const file = new URL('../src/data/articles.json', import.meta.url);
const { articles } = JSON.parse(readFileSync(file, 'utf8'));
const errors = [];
const seen = new Set();

for (const [i, a] of articles.entries()) {
  const id = `#${i} "${a.title ?? '?'}"`;
  if (!['published', 'pending'].includes(a.status)) errors.push(`${id}: status must be published|pending`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date) || isNaN(Date.parse(a.date))) errors.push(`${id}: date must be ISO yyyy-mm-dd`);
  if (!a.title) errors.push(`${id}: title required`);
  if (a.status === 'published') {
    for (const k of ['metric', 'where', 'url']) if (!a[k]) errors.push(`${id}: published entry needs ${k}`);
    if (a.url && !/^https:\/\//.test(a.url)) errors.push(`${id}: url must be https`);
    for (const m of a.also ?? []) if (!m.where || !/^https:\/\//.test(m.url ?? '')) errors.push(`${id}: bad mirror ${JSON.stringify(m)}`);
  }
  for (const u of [a.url, ...(a.also ?? []).map((m) => m.url)].filter(Boolean)) {
    if (seen.has(u)) errors.push(`${id}: duplicate url ${u}`);
    seen.add(u);
  }
}

const published = articles.filter((a) => a.status === 'published');
if (errors.length) {
  console.error(`articles.json: ${errors.length} problem(s)\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`articles.json OK — ${published.length} published, ${articles.length - published.length} pending`);
