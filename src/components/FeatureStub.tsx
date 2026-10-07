interface FeatureStubProps {
  question: number;
  title: string;
  branch: string;
  /** One-line brief of what the feature does. */
  brief: string;
  /** Concrete things the finished feature should do. */
  goals: string[];
}

/**
 * Placeholder rendered on `main` before a feature branch fills it in. Each feature
 * branch (feature/qN-*) replaces its page's body with the real implementation.
 */
export default function FeatureStub({ question, title, branch, brief, goals }: FeatureStubProps) {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
          Q{question}
        </span>
        <h1 className="text-2xl font-bold">{title}</h1>
        <code className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700">{branch}</code>
      </div>
      <p className="mb-6 max-w-2xl text-slate-600">{brief}</p>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          To build on {branch}
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-slate-700">
          {goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
