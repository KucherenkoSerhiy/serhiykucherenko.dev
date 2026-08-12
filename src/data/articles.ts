// Articles live where they were published. The site lists them and links out.
// Add a line per article; no body is kept here.
export type Article = {
  date: string; // ISO, publication date
  title: string;
  metric: string; // the one real number that carries the piece
  where: string; // platform label shown next to the link
  url: string;
};

export const articles: Article[] = [
  {
    date: '2026-08-09',
    title: 'The illusion of improvement',
    metric: '495 → 484 chunks, 0.60 → 0.60',
    where: 'linkedin',
    url: 'https://www.linkedin.com/pulse/illusion-improvement-serhiy-kucherenko-vw20e/',
  },
  {
    date: '2026-07-31',
    title: 'Three small lessons from building a RAG by hand',
    metric: '4.9 ms of 2,823 ms',
    where: 'linkedin',
    url: 'https://www.linkedin.com/pulse/three-small-lessons-from-building-rag-hand-serhiy-kucherenko-wgyce/',
  },
  {
    date: '2026-07-24',
    title: 'When 60% recall meant 90% accuracy: a RAG measurement story',
    metric: '6/10 → 9/10',
    where: 'linkedin',
    url: 'https://www.linkedin.com/pulse/when-60-recall-meant-90-accuracy-rag-measurement-story-kucherenko-aq8ue/',
  },
  {
    date: '2026-07-17',
    title: 'The localhost trap: a 10-second database connection on Windows',
    metric: '10,137 ms → 27 ms',
    where: 'linkedin',
    url: 'https://www.linkedin.com/pulse/localhost-trap-10-second-database-connection-windows-kucherenko-1cm1e/',
  },
];
