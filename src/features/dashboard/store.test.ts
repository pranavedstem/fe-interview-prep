import { beforeEach, describe, expect, it } from 'vitest';
import { useDashboardStore } from '@/features/dashboard/store';
import type { DashboardSnapshot } from '@/features/dashboard/types';

function snapshot(seq: number, overrides: Partial<DashboardSnapshot> = {}): DashboardSnapshot {
  return {
    seq,
    sales: { totalCents: 1000, orderCount: 10, changePct: 1 },
    activeUsers: 100,
    newOrders: [],
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  useDashboardStore.setState({
    lastSeq: 0,
    sales: { totalCents: 0, orderCount: 0, changePct: 0 },
    activeUsers: { current: 0, history: [] },
    recentOrders: { orders: [] },
    visibility: { sales: true, activeUsers: true, recentOrders: true },
  });
});

describe('dashboard store', () => {
  it('ignores a late response whose sequence is older than what is shown', () => {
    const { applySnapshot } = useDashboardStore.getState();
    applySnapshot(snapshot(5, { sales: { totalCents: 500, orderCount: 5, changePct: 2 } }));
    applySnapshot(snapshot(3, { sales: { totalCents: 999, orderCount: 9, changePct: 9 } }));

    expect(useDashboardStore.getState().sales.totalCents).toBe(500);
    expect(useDashboardStore.getState().lastSeq).toBe(5);
  });

  it('keeps the recent-orders reference stable when no new orders arrive', () => {
    const { applySnapshot } = useDashboardStore.getState();
    applySnapshot(snapshot(1, { newOrders: [{ id: 'a', customer: 'Ada', amountCents: 100 }] }));
    const first = useDashboardStore.getState().recentOrders;

    applySnapshot(snapshot(2, { sales: { totalCents: 42, orderCount: 1, changePct: 0 } }));
    const second = useDashboardStore.getState().recentOrders;

    expect(second).toBe(first);
    expect(useDashboardStore.getState().sales.totalCents).toBe(42);
  });

  it('persists widget visibility choices so they survive a refresh', () => {
    useDashboardStore.getState().toggleWidget('sales');

    expect(useDashboardStore.getState().visibility.sales).toBe(false);
    expect(localStorage.getItem('q4-dashboard')).toContain('"sales":false');
  });
});
