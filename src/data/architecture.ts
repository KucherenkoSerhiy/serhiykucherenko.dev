// Two altitudes, C4 style.
//   Level 1 (/systems)        — systems and the outside world. No internals.
//   Level 2 (/systems/<id>)   — one drill-down per system. Internals live here only.
// Nothing goes in until it actually runs; planned work is marked and stays marked.

export type SystemId = 'payments-rag' | 'oncall-triage' | 'tab-librarian' | 'site' | 'gateway';

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
    id: 'oncall-triage',
    name: 'oncall-triage',
    what: 'triages bank alerts from three clouds, pages or not',
    state: 'live',
    demo: 'https://triage.serhiykucherenko.dev',
    source: 'https://github.com/KucherenkoSerhiy/oncall-triage',
  },
  {
    id: 'tab-librarian',
    name: 'tab-librarian',
    what: 'files your open tabs into bookmarks, with your own key',
    state: 'live',
    demo: 'https://chromewebstore.google.com/detail/tab-librarian/hakiameklkpoediloonghmilhhlpjejd',
    source: 'https://github.com/KucherenkoSerhiy/tab-librarian',
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
  // Where the record lives when it is not on /decisions (other repos keep their own).
  adrHref?: string;
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
  'oncall-triage': {
    headline: 'Three bank estates, one triage brain. An alert comes in; a verdict comes out: page, ack or monitor.',
    lines: [
      {
        name: 'alert line',
        note: 'what happens when something breaks in an estate',
        stops: [
          {
            label: 'alert',
            does: 'CloudWatch on AWS, Azure Monitor, or Prometheus over Kafka on Kubernetes',
            tone: 'in',
            why: 'Three estates on purpose, each monitored its own way, because a triage system that has never seen an Alertmanager webhook or a consumer-lag alert is not credible.',
            adr: '0006',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0006-kubernetes-and-kafka.md',
          },
          {
            label: 'ingest',
            does: 'one canonical shape, HMAC-signed, PII scrubbed, duplicates dropped',
            tone: 'work',
            why: 'The brain runs on one cloud only; the other estates reach it over HTTPS with a signature. One LLM path to secure and pay for, and each cloud does something different.',
            adr: '0001',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0001-split-roles-topology.md',
          },
          {
            label: 'relay',
            does: 'Kafka alerts leave the cluster over plain outbound HTTPS',
            tone: 'work',
            why: 'A public Kafka endpoint meant a managed cluster and real money. A relay inside the cluster keeps the budget under ten dollars. The alert that says Kafka is down takes the other route, because it cannot travel over Kafka to say so.',
            adr: '0015',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0015-route-a-relay-instead-of-a-public-kafka-endpoint.md',
          },
          {
            label: 'triage',
            does: 'a three-role ADK agent on Claude Haiku reads the alert and the taught known issues',
            tone: 'work',
            why: 'Known issue: one terse line, no page. New: a researcher characterises it and a reporter writes the page recommendation. The model chooses the hand-off from what the store returned, not a fixed pipeline. Model id and prompt hash are stored on every verdict.',
            adr: '0004',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0004-claude-via-litellm.md',
          },
          {
            label: 'verdict + console',
            does: 'page, ack or monitor, one line of reasoning, and a place to teach the next one',
            tone: 'out',
            why: 'A static console over a small API instead of Slack or e-mail integrations, so the verdict record is the integration point and the demo has no moving parts.',
            adr: '0003',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0003-incident-console.md',
          },
        ],
      },
      {
        name: 'delivery line',
        note: 'how a change reaches the clouds',
        stops: [
          { label: 'pull request', does: 'Terraform plan posted on every PR', tone: 'in' },
          {
            label: 'C4 drift gate',
            does: 'the architecture model is checked against Terraform tags and Helm labels',
            tone: 'work',
            why: 'A renamed or deleted container fails the PR that introduces the mismatch, with a table naming which one. Diagrams nobody trusts are the alternative.',
            adr: '0016',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0016-c4-drift-as-a-merge-gate.md',
          },
          {
            label: 'apply',
            does: 'on merge, after approval, over OIDC only',
            tone: 'work',
            why: 'No cloud credential exists in GitHub. Images are named by git SHA, so rollback is re-running the workflow with a previous one. A rollback drill was run for real and recorded.',
            adr: '0008',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0008-delivery-pipeline.md',
          },
          {
            label: 'runbook',
            does: 'every likely cause cites the incident that taught it',
            tone: 'out',
            why: 'A runbook section with no citation is either mechanism-only or speculative. The failures that happened are the ones documented.',
            adr: '0017',
            adrHref: 'https://github.com/KucherenkoSerhiy/oncall-triage/blob/master/docs/adr/0017-runbooks-derived-from-incidents.md',
          },
        ],
      },
    ],
    runsOn: [
      { label: 'AWS', note: 'lambda · sqs · dynamodb · the brain' },
      { label: 'Azure', note: 'functions · azure monitor · one estate' },
      { label: 'Kubernetes', note: 'kind · helm · prometheus · strimzi kafka' },
      { label: 'Claude Haiku', note: 'via ADK and LiteLLM' },
      { label: 'GitHub Actions', note: 'plan, apply, weekly estate demo' },
    ],
    notes: [
      'Recorded, unattended: an AWS chaos alarm to a known-issue verdict in about 3 to 4 minutes; Azure in about 7, because its monitor evaluates slower.',
      'Kafka broker scaled to zero: the verdict about Kafka arrived over the other route. The system does not claim its Kafka transport survived a Kafka outage.',
      'Cloud bill under ten dollars a month, the model a few more, both budgeted and alarmed.',
    ],
  },
  'tab-librarian': {
    headline: 'A Chrome side panel that files open tabs into a bookmark tree you approve. Your key, no backend, nothing phoned home.',
    lines: [
      {
        name: 'filing line',
        note: 'from a wall of tabs to a library',
        stops: [
          { label: 'open tabs', does: 'titles and urls, read from the window', tone: 'in' },
          {
            label: 'redact',
            does: 'private-network urls excluded, sensitive bits stripped, preview before anything is sent',
            tone: 'work',
            why: 'The model sees what the user has approved to send, and nothing else. There is no server in between to trust.',
          },
          {
            label: 'model',
            does: 'your own key: Anthropic with streaming and strict tool use, or any OpenAI-compatible endpoint',
            tone: 'work',
            why: 'Bring your own key means no accounts, no telemetry and no bill on this side. The cost is a setup step the user has to do once.',
          },
          {
            label: 'proposal',
            does: 'a nested tree, shown as a diff against the existing bookmarks',
            tone: 'work',
          },
          {
            label: 'apply',
            does: 'with undo, redo and snapshots',
            tone: 'out',
            why: "Bookmarks are the user's data. Every change is reversible, so a wrong proposal costs one click.",
          },
        ],
      },
    ],
    runsOn: [
      { label: 'Chrome · Brave', note: 'manifest v3 side panel' },
      { label: 'TypeScript', note: 'unit tests plus a mock-chrome harness' },
      { label: 'Chrome Web Store', note: 'published, in daily use' },
    ],
    notes: ['Built for one user first. Maintained when something breaks.'],
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
