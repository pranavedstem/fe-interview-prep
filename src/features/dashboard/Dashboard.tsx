import { useDashboardFeed } from '@/features/dashboard/useDashboardFeed';
import { useDashboardStore } from '@/features/dashboard/store';
import WidgetToggles from '@/features/dashboard/WidgetToggles';
import SalesWidget from '@/features/dashboard/SalesWidget';
import ActiveUsersWidget from '@/features/dashboard/ActiveUsersWidget';
import RecentOrdersWidget from '@/features/dashboard/RecentOrdersWidget';

export default function Dashboard() {
  useDashboardFeed();
  const visibility = useDashboardStore((state) => state.visibility);

  return (
    <section>
      <h1 className="mb-2 text-2xl font-bold">Live Dashboard</h1>
      <p className="mb-6 max-w-2xl text-slate-600">
        Widgets refresh every 5 seconds and pause while the browser tab is hidden.
      </p>
      <div className="mb-6">
        <WidgetToggles />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibility.sales && <SalesWidget />}
        {visibility.activeUsers && <ActiveUsersWidget />}
        {visibility.recentOrders && <RecentOrdersWidget />}
      </div>
    </section>
  );
}
