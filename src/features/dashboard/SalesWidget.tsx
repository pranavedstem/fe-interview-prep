import clsx from 'clsx';
import { useDashboardStore } from '@/features/dashboard/store';
import { formatCents, formatCount, formatPct } from '@/features/dashboard/format';

export default function SalesWidget() {
  const sales = useDashboardStore((state) => state.sales);
  const positive = sales.changePct >= 0;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Sales</h3>
      <p className="mt-2 text-3xl font-bold text-slate-900">{formatCents(sales.totalCents)}</p>
      <p className="mt-1 text-sm text-slate-500">{formatCount(sales.orderCount)} orders today</p>
      <span
        className={clsx(
          'mt-3 inline-block rounded px-2 py-0.5 text-xs font-semibold',
          positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
        )}
      >
        {formatPct(sales.changePct)} vs yesterday
      </span>
    </article>
  );
}
