// The brick castle: every shipped thing is a brick. Bricks stack into towers
// (projects), towers stand on shared foundations. Add a brick when something
// actually ships — that is the only rule.
export type BrickState = 'shipped' | 'dep' | 'planned' | 'parked';

export type CastleBrick = {
  label: string;
  note?: string;
  state: BrickState;
  wide?: boolean; // spans two columns in its tower
};

export type Tower = {
  name: string;
  status: string;
  bricks: CastleBrick[]; // bottom-up: first entry sits on the foundation
  href?: string;
};

// Shared ground every tower stands on.
export const foundation: CastleBrick[] = [
  { label: 'Cloudflare', note: 'dns · cdn · waf', state: 'dep' },
  { label: 'Fly.io', note: 'app runtime', state: 'dep' },
  { label: 'Neon Postgres', note: 'pgvector', state: 'dep' },
  { label: 'GitHub', note: 'source · ci trigger', state: 'dep' },
];

export const towers: Tower[] = [
  {
    name: 'payments-rag',
    status: 'live',
    href: 'https://rag.serhiykucherenko.dev',
    bricks: [
      { label: 'corpus ingest', note: 'SEPA rulebooks → chunks', state: 'shipped' },
      { label: 'vector retriever', note: 'pgvector, top-k', state: 'shipped' },
      { label: 'page citations', note: 'answer carries its source', state: 'shipped', wide: true },
      { label: 'golden set + answer eval', state: 'shipped' },
      { label: 'cross-model judge', note: 'one model grades the other', state: 'shipped' },
      { label: 'per-stage timers', state: 'shipped' },
      { label: 'health checks', note: 'five deps, every 10 min', state: 'shipped' },
      { label: 'public deploy', note: 'rate limits · budget cap', state: 'shipped', wide: true },
      { label: 'hybrid search', note: 'measured, no lift — parked', state: 'parked' },
      { label: 'reranker', note: 'built, eval-only', state: 'parked' },
    ],
  },
  {
    name: 'serhiykucherenko.dev',
    status: 'live',
    href: '/',
    bricks: [
      { label: 'static build', note: 'astro · zero trackers', state: 'shipped' },
      { label: 'wire theme', note: 'dark + light tokens', state: 'shipped' },
      { label: 'diagram language', note: 'waterfall · pipeline · brick', state: 'shipped', wide: true },
      { label: 'ship log', state: 'shipped' },
      { label: 'og + structured data', state: 'shipped' },
      { label: 'rag subdomain', note: 'proxied · rate-limited', state: 'shipped' },
    ],
  },
  {
    name: 'llm-cost-gateway',
    status: 'scoping',
    bricks: [
      { label: 'provider abstraction', state: 'planned' },
      { label: 'semantic cache', state: 'planned' },
      { label: 'spend tracking', state: 'planned' },
      { label: 'budget alerts', state: 'planned' },
    ],
  },
];
