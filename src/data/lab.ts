// The lab holds questions, not projects. A question earns a place when it is
// being tested for real; it leaves when it is answered and written up, or when
// it is abandoned on purpose. Anything that grows up moves to /systems.
export type Experiment = {
  question: string;
  state: 'open' | 'answered' | 'dropped';
  context: string; // where the question came from
  finding?: string; // only when answered or dropped
  metric?: string; // the number that settled it
  evidence?: { label: string; url: string };
};

export const experiments: Experiment[] = [
  {
    question: 'What does hybrid search actually buy on a two-document corpus?',
    state: 'answered',
    context: 'payments-rag · recall stuck at 0.60',
    finding: 'No lift at all. Big-corpus results from the literature did not transfer. Vector stayed the default.',
    metric: '0.60 → 0.60',
    evidence: {
      label: 'the measurement write-up',
      url: 'https://www.linkedin.com/pulse/when-60-recall-meant-90-accuracy-rag-measurement-story-kucherenko-aq8ue/',
    },
  },
  {
    question: 'How much of a retrieval miss can a reranker actually rescue?',
    state: 'answered',
    context: 'payments-rag · the fashionable next move',
    finding:
      'Only the ones already fetched. It promoted every reachable page and then hit a hard ceiling, at seconds per query. Built, measured, left out of the live path.',
    metric: '0.60 → 0.70, ceiling',
    evidence: {
      label: 'the measurement write-up',
      url: 'https://www.linkedin.com/pulse/when-60-recall-meant-90-accuracy-rag-measurement-story-kucherenko-aq8ue/',
    },
  },
  {
    question: 'Why do two evals of the same system disagree?',
    state: 'answered',
    context: 'payments-rag · two evals disagreeing',
    finding:
      'The metric. It checked for one labelled page while the answer sat on a different, equally correct one. Score the fact instead of the page and the two evals reconcile.',
    metric: '6/10 → 9/10',
    evidence: {
      label: 'the measurement write-up',
      url: 'https://www.linkedin.com/pulse/when-60-recall-meant-90-accuracy-rag-measurement-story-kucherenko-aq8ue/',
    },
  },
  {
    question: 'How far can a public LLM demo be pushed before the budget bites?',
    state: 'open',
    context: 'payments-rag · open to anyone, no sign-in',
    finding: 'Live behind rate limits and a hard daily cap. Nobody has found the ceiling yet, which is itself the uninteresting half of the answer.',
    evidence: { label: 'try it', url: 'https://rag.serhiykucherenko.dev' },
  },
  {
    question: 'How do you pick a golden set worth trusting?',
    state: 'open',
    context: 'payments-rag · every eval rests on it',
    finding:
      'Ten questions is a noisy ruler, and picking more of them is not obviously the fix. What makes a question worth including is the open part.',
  },
];
