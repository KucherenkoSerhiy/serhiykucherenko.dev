// Real, dated milestones that aren't blog posts. No invented metrics — every
// figure here actually happened and is verifiable. Merged with blog posts on
// the ship log, newest first.
export type Milestone = {
  date: string; // ISO
  kind: 'ship' | 'milestone';
  title: string;
  sub: string;
  metric: string;
  metricTone: 'accent' | 'ok';
  href?: string;
};

export const milestones: Milestone[] = [
  {
    date: '2026-07-20',
    kind: 'ship',
    title: 'payments-rag demo went live',
    sub: 'rag.serhiykucherenko.dev · fly.io · pgvector + claude',
    metric: 'rag → prod',
    metricTone: 'ok',
    href: 'https://rag.serhiykucherenko.dev',
  },
  {
    date: '2026-07-19',
    kind: 'milestone',
    title: 'Site launched, built static',
    sub: 'cloudflare · lighthouse 100 · 0 trackers',
    metric: '100/100',
    metricTone: 'accent',
  },
];
