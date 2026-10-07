export type WidgetId = 'sales' | 'activeUsers' | 'recentOrders';

export interface SalesData {
  totalCents: number;
  orderCount: number;
  changePct: number;
}

export interface ActiveUsersData {
  current: number;
  history: number[];
}

export interface Order {
  id: string;
  customer: string;
  amountCents: number;
}

export interface RecentOrdersData {
  orders: Order[];
}

export interface DashboardSnapshot {
  seq: number;
  sales: SalesData;
  activeUsers: number;
  newOrders: Order[];
}
