import clsx from 'clsx';
import { useDashboardStore } from '@/features/dashboard/store';
import type { WidgetId } from '@/features/dashboard/types';

const WIDGETS: { id: WidgetId; label: string }[] = [
  { id: 'sales', label: 'Sales' },
  { id: 'activeUsers', label: 'Active users' },
  { id: 'recentOrders', label: 'Recent orders' },
];

export default function WidgetToggles() {
  const visibility = useDashboardStore((state) => state.visibility);
  const toggleWidget = useDashboardStore((state) => state.toggleWidget);

  return (
    <div className="flex flex-wrap gap-2">
      {WIDGETS.map(({ id, label }) => {
        const shown = visibility[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleWidget(id)}
            aria-pressed={shown}
            className={clsx(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
              shown
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100',
            )}
          >
            {shown ? 'Hide' : 'Show'} {label}
          </button>
        );
      })}
    </div>
  );
}
