import { NavLink, Route, Routes } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from '@/routes';

function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3">
        <span className="mr-4 font-semibold text-slate-900">FE Interview Prep</span>
        {routes
          .filter((route) => !route.hidden)
          .map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === '/'}
              className={({ isActive }) =>
                clsx(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              {route.label}
            </NavLink>
          ))}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          {routes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
          <Route path="*" element={<p className="text-slate-500">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}
