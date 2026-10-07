import type { ActiveUsersData, Order, SalesData } from '@/features/dashboard/types';

export function shouldApply(lastSeq: number, seq: number): boolean {
  return seq > lastSeq;
}

export function appendHistory(history: number[], value: number, max: number): number[] {
  const next = [...history, value];
  return next.length > max ? next.slice(next.length - max) : next;
}

export function mergeOrders(previous: Order[], incoming: Order[], max: number): Order[] {
  if (incoming.length === 0) return previous;
  const seen = new Set(previous.map((order) => order.id));
  const fresh = incoming.filter((order) => !seen.has(order.id));
  if (fresh.length === 0) return previous;
  return [...fresh, ...previous].slice(0, max);
}

export function salesEqual(a: SalesData, b: SalesData): boolean {
  return (
    a.totalCents === b.totalCents && a.orderCount === b.orderCount && a.changePct === b.changePct
  );
}

export function activeUsersEqual(a: ActiveUsersData, b: ActiveUsersData): boolean {
  return (
    a.current === b.current &&
    a.history.length === b.history.length &&
    a.history.every((value, index) => value === b.history[index])
  );
}
