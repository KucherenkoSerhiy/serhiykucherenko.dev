// Decision records from payments-rag, summarised. Each one names what was
// chosen, what was turned down, and what the choice costs. Full text lives in
// the repo; these are the one-line versions so the trade-off is readable here.
//
// Source: github.com/KucherenkoSerhiy/payments-rag/tree/main/docs/adr
const REPO = 'https://github.com/KucherenkoSerhiy/payments-rag/blob/main/docs/adr';

export type Decision = {
  id: string;
  title: string;
  date: string;
  status: 'accepted' | 'superseded' | 'measured-wrong';
  chose: string;
  insteadOf: string;
  cost: string;
  file: string;
  note?: string;
};

export const decisions: Decision[] = [
  {
    id: '0018',
    title: 'Public deploy on Fly and Neon, with no login',
    date: '2026-07-17',
    status: 'accepted',
    chose: 'One small Fly machine that sleeps when idle, Postgres on Neon, everything public including the eval and usage views.',
    insteadOf: 'Staying local-only, or building accounts to gate the admin views.',
    cost: 'The glass-box views are exposed to anyone. Abuse and spend are handled with rate limits and a hard daily cap instead of a login.',
    file: '0018-cloud-deploy-fly-neon.md',
    note: 'supersedes 0013',
  },
  {
    id: '0017',
    title: 'Angular front end over a FastAPI backend',
    date: '2026-07-11',
    status: 'accepted',
    chose: 'A real SPA plus an API layer, because a hosted deploy needs the API anyway and the target UX had outgrown the prototype.',
    insteadOf: 'Keeping the Streamlit prototype that had served its purpose.',
    cost: 'More surface to maintain than a one-file UI.',
    file: '0017-frontend-angular-fastapi.md',
    note: 'supersedes 0010',
  },
  {
    id: '0016',
    title: 'Reranker built as an LLM cross-encoder, kept out of the live path',
    date: '2026-07-09',
    status: 'accepted',
    chose: 'Score each pair with a model call, run it in evals only, leave the interactive path on plain vector search.',
    insteadOf: 'A local cross-encoder model, which would drag a heavy ML stack in for a two-document corpus.',
    cost: 'Seconds per query, which is exactly why it never reached the live path. It bought +0.10 recall and hit the fan-out ceiling.',
    file: '0016-reranker-llm-cross-encoder-eval-only.md',
  },
  {
    id: '0015',
    title: 'Package by concern, extract the LLM adapter',
    date: '2026-07-06',
    status: 'accepted',
    chose: 'Group modules so the folder tree reads as the pipeline, and give the model client its own adapter beside the embedding one.',
    insteadOf: 'A flat package where the layout said nothing about the architecture.',
    cost: 'A round of import churn, paid once.',
    file: '0015-package-by-concern-llm-adapter.md',
  },
  {
    id: '0014',
    title: 'Adopt a retrieval technique only if it moves the number',
    date: '2026-07-04',
    status: 'accepted',
    chose: 'Measure hybrid search and reranking against the recall baseline, keep vector as the default, adopt nothing that does not earn it.',
    insteadOf: 'Simply handing the model more chunks, which inflates cost and dilutes context without improving ranking.',
    cost: 'Slower to adopt fashionable techniques. Two of them were built and then declined.',
    file: '0014-improve-retrieval-rerank-hybrid.md',
  },
  {
    id: '0013',
    title: 'Docker locally, no hosted service',
    date: '2026-06',
    status: 'superseded',
    chose: 'Reviewers clone the repo and run it, so there is no cost, no ops, and no secrets story to build.',
    insteadOf: 'A hosted demo URL.',
    cost: 'No public demo. That calculus changed once articles started linking here, which is what superseded it.',
    file: '0013-deploy-docker-local.md',
    note: 'superseded by 0018',
  },
  {
    id: '0012',
    title: 'Golden set lives in the repo as YAML',
    date: '2026-06',
    status: 'accepted',
    chose: 'Ground truth as a diffable file, so changing it shows up in review.',
    insteadOf: 'A database or an external eval service.',
    cost: 'Single author, no concurrent editing. In exchange, quietly editing the set to chase a number is visible.',
    file: '0012-golden-set-in-repo.md',
  },
  {
    id: '0011',
    title: 'Code in its own repository',
    date: '2026-06-15',
    status: 'accepted',
    chose: 'Keep source separate from planning notes so the repo is standalone software.',
    insteadOf: 'One repo holding both code and the surrounding notes.',
    cost: 'Two places to keep in step.',
    file: '0011-repo-layout.md',
  },
  {
    id: '0010',
    title: 'Minimal Streamlit UI',
    date: '2026-06',
    status: 'superseded',
    chose: 'The smallest possible query box, to see what retrieval was actually returning.',
    insteadOf: 'Building a real front end before knowing what the app should show.',
    cost: 'A design ceiling, reached once the app grew three views. Kept as history rather than deleted.',
    file: '0010-streamlit-ui.md',
    note: 'superseded by 0017',
  },
  {
    id: '0009',
    title: 'Strip boilerplate and chunk on sentence boundaries',
    date: '2026-07-01',
    status: 'measured-wrong',
    chose: 'Remove the header and footer that repeat on every page, and pack whole sentences instead of fixed word windows.',
    insteadOf: 'Feeding raw page text straight to the embedder.',
    cost: 'The hypothesis was that cleaner chunks would sharpen retrieval. Measured: no change at all, 0.34 to 0.34. Kept for cleanliness, and the wrong prediction is recorded rather than buried.',
    file: '0009-boilerplate-and-sentence-chunking.md',
  },
  {
    id: '0008',
    title: 'A chunk never spans two pages',
    date: '2026-07-01',
    status: 'accepted',
    chose: 'Chunk within each page, so every citation points at exactly one page.',
    insteadOf: 'Concatenating the document first, which keeps ideas whole across a page break.',
    cost: 'Context is lost at page seams. Accepted because the product is verifiable citations, and an ambiguous page number undoes the whole point.',
    file: '0008-per-page-chunking.md',
  },
  {
    id: '0007',
    title: 'The eval judge must be a different model from the one being graded',
    date: '2026-06',
    status: 'accepted',
    chose: 'One vendor answers, another grades, on a 0 to 100 scale with a critique.',
    insteadOf: 'Exact text match (fails on paraphrase), embedding similarity (too kind to wrong-but-similar answers), or the same model grading itself.',
    cost: 'A second vendor dependency and a per-eval bill. The judge itself gets spot-checked by hand, because a judge is not automatically right.',
    file: '0007-cross-model-llm-judge.md',
  },
  {
    id: '0006',
    title: 'Citations returned as structured JSON, not inline markers',
    date: '2026-06',
    status: 'accepted',
    chose: 'The model returns an answer plus a list of chunk ids, so every link is machine-checkable.',
    insteadOf: 'Citation markers written inline in the prose, which read more naturally.',
    cost: 'A stricter prompt and a schema to conform to. In exchange a hallucinated citation fails loudly instead of rendering a wrong link.',
    file: '0006-structured-json-citations.md',
  },
  {
    id: '0005',
    title: 'Claude Haiku answers in production',
    date: '2026-06-15',
    status: 'accepted',
    chose: 'The cheap tier, with the model name behind an env var so swapping it is config, not code.',
    insteadOf: 'The stronger, roughly three times pricier tier.',
    cost: 'Likely lower accuracy on dense spec text. Accepted only because the eval can quantify the gap on demand rather than guessing at it.',
    file: '0005-production-llm-haiku.md',
    note: 'forced by a model retirement mid-project',
  },
  {
    id: '0004',
    title: 'Raw API calls, no orchestration framework',
    date: '2026-06',
    status: 'accepted',
    chose: 'Hand-written orchestration against the vendor SDKs, so every prompt is legible.',
    insteadOf: 'LangChain or LangGraph, which would write less glue code.',
    cost: 'More lines by hand. If orchestration ever grows genuinely complex this decision gets superseded in the open, not quietly violated.',
    file: '0004-raw-api-no-framework.md',
  },
  {
    id: '0003',
    title: 'One embedding model, pinned and guarded',
    date: '2026-06',
    status: 'accepted',
    chose: 'A single small embedding model, pinned in config, with a dimension guard that rejects a mismatch at insert time.',
    insteadOf: 'The larger model at several times the cost, or a local model that pulls in a heavy ML stack.',
    cost: 'Changing the model later invalidates every stored vector and forces a full re-embed. The guard makes that failure loud instead of silent.',
    file: '0003-embedding-model-pinned.md',
  },
  {
    id: '0002',
    title: 'Vectors live in Postgres, not a dedicated vector database',
    date: '2026-06',
    status: 'accepted',
    chose: 'pgvector, so text, metadata and vector sit in one row and citations join trivially.',
    insteadOf: 'A specialised vector database, which means a new system to learn, run and pay for.',
    cost: 'Good to roughly a million vectors, then this gets superseded. The retriever call is the seam that would change, and it was written to be that seam.',
    file: '0002-vector-store-pgvector.md',
  },
  {
    id: '0001',
    title: 'Build it in Python, not the strongest stack in the room',
    date: '2026-06',
    status: 'accepted',
    chose: 'Python, because every library in this space is Python-first.',
    insteadOf: '.NET, where the work would have been faster to write but every dependency would fight the grain.',
    cost: 'Working outside the primary stack, deliberately. The judgment transfers; the syntax was the cheap part.',
    file: '0001-language-python.md',
  },
];

export const adrUrl = (d: Decision) => `${REPO}/${d.file}`;
export const REPO_ADR_INDEX = 'https://github.com/KucherenkoSerhiy/payments-rag/tree/main/docs/adr';
