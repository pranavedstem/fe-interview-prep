import { useDashboardStore } from '@/features/dashboard/store';
import { formatCents } from '@/features/dashboard/format';

export default function RecentOrdersWidget() {
  const orders = useDashboardStore((state) => state.recentOrders.orders);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
        Recent orders
      </h3>
      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Waiting for orders…</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-slate-700">{order.customer}</span>
              <span className="font-semibold text-slate-900">{formatCents(order.amountCents)}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
