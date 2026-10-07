import { useDashboardStore } from '@/features/dashboard/store';
import { formatCount } from '@/features/dashboard/format';

const CHART_WIDTH = 280;
const CHART_HEIGHT = 72;

function toPolyline(history: number[]): string {
  if (history.length < 2) return '';
  const max = Math.max(...history);
  const min = Math.min(...history);
  const span = max - min || 1;
  const step = CHART_WIDTH / (history.length - 1);
  return history
    .map((value, index) => {
      const x = index * step;
      const y = CHART_HEIGHT - ((value - min) / span) * CHART_HEIGHT;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function ActiveUsersWidget() {
  const activeUsers = useDashboardStore((state) => state.activeUsers);
  const points = toPolyline(activeUsers.history);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Active users</h3>
      <p className="mt-2 text-3xl font-bold text-slate-900">{formatCount(activeUsers.current)}</p>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Active users over the recent polling window"
        className="mt-3 h-20 w-full text-blue-600"
      >
        {points ? (
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : (
          <text x="4" y="40" className="fill-slate-400 text-xs">
            Collecting data…
          </text>
        )}
      </svg>
    </article>
  );
}
