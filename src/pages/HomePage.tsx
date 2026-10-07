import { Link } from 'react-router-dom';
import { routes } from '@/routes';

export default function HomePage() {
  const features = routes.filter((route) => route.question !== null && !route.hidden);

  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold">Frontend Interview Prep</h1>
      <p className="mb-8 max-w-2xl text-slate-600">
        Five React + TypeScript features, each on its own route and shipped as its own pull request.
        Pick a feature to open it.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {features.map((route) => (
          <li key={route.path}>
            <Link
              to={route.path}
              className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                  Q{route.question}
                </span>
                <span className="text-lg font-semibold">{route.label}</span>
              </div>
              {route.branch ? <code className="text-xs text-slate-500">{route.branch}</code> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
