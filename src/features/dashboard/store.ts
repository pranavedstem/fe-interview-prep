import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActiveUsersData,
  DashboardSnapshot,
  RecentOrdersData,
  SalesData,
  WidgetId,
} from '@/features/dashboard/types';
import {
  activeUsersEqual,
  appendHistory,
  mergeOrders,
  salesEqual,
  shouldApply,
} from '@/features/dashboard/logic';

const HISTORY_LENGTH = 24;
const MAX_ORDERS = 8;

const initialSales: SalesData = { totalCents: 0, orderCount: 0, changePct: 0 };
const initialActiveUsers: ActiveUsersData = { current: 0, history: [] };
const initialRecentOrders: RecentOrdersData = { orders: [] };

interface DashboardState {
  lastSeq: number;
  sales: SalesData;
  activeUsers: ActiveUsersData;
  recentOrders: RecentOrdersData;
  visibility: Record<WidgetId, boolean>;
  applySnapshot: (snapshot: DashboardSnapshot) => void;
  toggleWidget: (id: WidgetId) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      lastSeq: 0,
      sales: initialSales,
      activeUsers: initialActiveUsers,
      recentOrders: initialRecentOrders,
      visibility: { sales: true, activeUsers: true, recentOrders: true },
      applySnapshot: (snapshot) => {
        const state = get();
        if (!shouldApply(state.lastSeq, snapshot.seq)) return;

        const nextSales = salesEqual(state.sales, snapshot.sales) ? state.sales : snapshot.sales;

        const candidateActiveUsers: ActiveUsersData = {
          current: snapshot.activeUsers,
          history: appendHistory(state.activeUsers.history, snapshot.activeUsers, HISTORY_LENGTH),
        };
        const nextActiveUsers = activeUsersEqual(state.activeUsers, candidateActiveUsers)
          ? state.activeUsers
          : candidateActiveUsers;

        const mergedOrders = mergeOrders(state.recentOrders.orders, snapshot.newOrders, MAX_ORDERS);
        const nextRecentOrders =
          mergedOrders === state.recentOrders.orders
            ? state.recentOrders
            : { orders: mergedOrders };

        set({
          lastSeq: snapshot.seq,
          sales: nextSales,
          activeUsers: nextActiveUsers,
          recentOrders: nextRecentOrders,
        });
      },
      toggleWidget: (id) =>
        set((state) => ({ visibility: { ...state.visibility, [id]: !state.visibility[id] } })),
    }),
    {
      name: 'q4-dashboard',
      partialize: (state) => ({ visibility: state.visibility }),
    },
  ),
);
