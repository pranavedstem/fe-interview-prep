import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/pages/DashboardPage';
import { useDashboardStore } from '@/features/dashboard/store';
import * as api from '@/features/dashboard/api';
import type { DashboardSnapshot } from '@/features/dashboard/types';

function snapshot(seq: number): DashboardSnapshot {
  return {
    seq,
    sales: { totalCents: 123456, orderCount: 42, changePct: 5 },
    activeUsers: 321,
    newOrders: [{ id: `order-${seq}`, customer: 'Grace Hopper', amountCents: 2500 }],
  };
}

function setHidden(hidden: boolean) {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden });
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
  setHidden(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DashboardPage', () => {
  it('renders live widgets from the feed', async () => {
    vi.spyOn(api, 'fetchSnapshot').mockImplementation((seq) => Promise.resolve(snapshot(seq)));
    render(<DashboardPage />);

    expect(await screen.findByText('$1,234.56')).toBeInTheDocument();
    expect(screen.getByText('321')).toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
  });

  it('hides a widget when toggled and remembers the choice', async () => {
    vi.spyOn(api, 'fetchSnapshot').mockImplementation((seq) => Promise.resolve(snapshot(seq)));
    const user = userEvent.setup();
    render(<DashboardPage />);
    await screen.findByText('$1,234.56');

    await user.click(screen.getByRole('button', { name: /hide sales/i }));

    expect(screen.queryByText('$1,234.56')).not.toBeInTheDocument();
    expect(localStorage.getItem('q4-dashboard')).toContain('"sales":false');
  });

  it('does not poll while the browser tab is hidden', async () => {
    const fetchSpy = vi
      .spyOn(api, 'fetchSnapshot')
      .mockImplementation((seq) => Promise.resolve(snapshot(seq)));
    setHidden(true);

    render(<DashboardPage />);
    await Promise.resolve();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
