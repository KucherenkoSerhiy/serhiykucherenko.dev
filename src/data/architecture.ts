// Two altitudes, C4 style.
//   Level 1 (/systems)        — systems and the outside world. No internals.
//   Level 2 (/systems/<id>)   — one drill-down per system. Internals live here only.
// Nothing goes in until it actually runs; planned work is marked and stays marked.

export type SystemId = 'payments-rag' | 'site' | 'gateway';

export type SystemSummary = {
  id: SystemId;
  name: string;
  what: string; // one line: what it does for whom
  state: 'live' | 'planned';
  demo?: string;
  source?: string;
};

export const systems: SystemSummary[] = [
  {
    id: 'site',
    name: 'serhiykucherenko.dev',
    what: 'this site — writing, projects, contact',
    state: 'live',
    demo: 'https://serhiykucherenko.dev',
    source: 'https://github.com/KucherenkoSerhiy/serhiykucherenko.dev',
  },
  {
    id: 'payments-rag',
    name: 'payments-rag',
    what: 'answers SEPA questions with the page cited',
    state: 'live',
    demo: 'https://rag.serhiykucherenko.dev',
    source: 'https://github.com/KucherenkoSerhiy/payments-rag',
  },
  {
    id: 'gateway',
    name: 'llm-cost-gateway',
    what: 'caches and meters model calls',
    state: 'planned',
  },
];

// ---------------------------------------------------------------- level 2

export type Stop = {
  label: string;
  does: string; // its one responsibility
  tone?: 'in' | 'work' | 'out' | 'planned';
  // The decision behind this stop, if there was a real one. adr points at a
  // record on /decisions; the wording here is the short form of its trade-off.
  why?: string;
  adr?: string;
};

export type Line = {
  name: string;
  note: string;
  stops: Stop[];
  planned?: boolean;
};

export type Detail = {
  id: SystemId;
  headline: string;
  lines: Line[];
  runsOn: { label: string; note: string }[];
  notes?: string[];
};

export const details: Record<SystemId, Detail> = {
  'payments-rag': {
    headline: 'Two journeys over the same stops: a live question, and the eval that grades it.',
    lines: [
      {
        name: 'question line',
        note: 'what happens when someone asks something',
        stops: [
          { label: 'question', does: 'plain English, from the demo page', tone: 'in' },
          {
            label: 'embed',
            does: 'one pinned embedding model',
            tone: 'work',
            why: 'Pinned and guarded at insert, because changing it later invalidates every stored vector. Chose the small model over one costing several times more.',
            adr: '0003',
          },
          {
            label: 'retrieve',
            does: 'top-k over page chunks in pgvector',
            tone: 'work',
            why: 'Vectors live in Postgres rather than a dedicated vector database, so citations join to their text in one query. Good to roughly a million vectors, then this gets superseded.',
            adr: '0002',
          },
          {
            label: 'generate',
            does: 'the cheap model tier answers, from retrieved pages only',
            tone: 'work',
            why: 'The model name is an env var, so the quality-versus-cost question stays measurable instead of argued.',
            adr: '0005',
          },
          {
            label: 'answer + page',
            does: 'structured citation, never inline guesswork',
            tone: 'out',
            why: 'Citations come back as data, not as markers in prose, so a hallucinated one fails loudly instead of rendering a wrong link. Chunks never span two pages for the same reason.',
            adr: '0006',
          },
        ],
      },
      {
        name: 'eval line',
        note: 'runs on demand over the same stops, with known-good questions',
        stops: [
          {
            label: 'golden set',
            does: 'questions with known answers, in the repo',
            tone: 'in',
            why: 'Ground truth is a file in version control, so editing it to flatter a number shows up in review.',
            adr: '0012',
          },
          {
            label: 'retrieve',
            does: 'same retriever, scored on recall',
            tone: 'work',
            why: 'Hybrid search and a reranker were both measured here. Neither earned a place in the live path.',
            adr: '0014',
          },
          { label: 'generate', does: 'same prompt path', tone: 'work' },
          {
            label: 'judge',
            does: 'a different vendor grades the answer',
            tone: 'work',
            why: 'A model grading its own output shares its own blind spots. Exact match fails on paraphrase and similarity is too kind to wrong-but-close answers.',
            adr: '0007',
          },
          { label: 'score', does: 'recall and answer pass rate', tone: 'out' },
        ],
      },
    ],
    runsOn: [
      { label: 'Fly.io', note: 'one small machine, auto-stop' },
      { label: 'Neon Postgres', note: 'pgvector, SEPA corpus' },
      { label: 'Claude · GPT', note: 'one generates, the other judges' },
      { label: 'Cloudflare', note: 'proxy, rate limit on /ask' },
    ],
    notes: [
      'Every stage is timed separately, so a slow answer says which stop was slow.',
      'Health checks ping all five dependencies on demand and every 10 minutes.',
      'Hybrid search and a reranker were built and measured. Neither earned a place on the line.',
    ],
  },
  site: {
    headline: 'A build step, not a server. Nothing runs when you read it.',
    lines: [
      {
        name: 'publish line',
        note: 'from a commit to the page in front of you',
        stops: [
          {
            label: 'edit',
            does: 'a data file or a page, in the repo',
            tone: 'in',
            why: 'Content is typed data rather than a CMS. Adding an article is one line; there is no admin to log into and nothing to keep patched.',
          },
          { label: 'push', does: 'to main, which is the only trigger', tone: 'work' },
          {
            label: 'build',
            does: 'every page rendered to static html',
            tone: 'work',
            why: 'Static over a server, so a bad deploy cannot take the site down: the previous build keeps serving.',
          },
          { label: 'deploy', does: 'assets go to the edge', tone: 'work' },
          {
            label: 'read',
            does: 'served from the city nearest you',
            tone: 'out',
            why: 'No trackers and no third-party scripts, which is most of why it loads the way it does.',
          },
        ],
      },
    ],
    runsOn: [
      { label: 'Cloudflare', note: 'build, host, dns, waf' },
      { label: 'GitHub', note: 'source and the deploy trigger' },
    ],
    notes: [
      'No database, no server, no tracker. A failed build keeps the previous version live.',
      'Articles are not stored here — the site links out to where each was published.',
    ],
  },
  gateway: {
    headline: 'Scoping. It will sit between an app and the model providers.',
    lines: [
      {
        name: 'planned line',
        note: 'nothing here is built yet',
        planned: true,
        stops: [
          { label: 'app call', does: 'the request an app would send anyway', tone: 'in' },
          { label: 'cache lookup', does: 'has something close enough been asked?', tone: 'planned' },
          { label: 'budget check', does: 'refuse before the bill, not after', tone: 'planned' },
          { label: 'provider', does: 'one interface, several providers behind it', tone: 'planned' },
          { label: 'meter', does: 'cost recorded per feature', tone: 'planned' },
        ],
      },
    ],
    runsOn: [{ label: 'undecided', note: 'scoping phase' }],
    notes: ['payments-rag calls the models directly today. This is the piece that would sit between.'],
  },
};
