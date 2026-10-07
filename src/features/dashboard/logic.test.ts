import { describe, expect, it } from 'vitest';
import {
  activeUsersEqual,
  appendHistory,
  mergeOrders,
  salesEqual,
  shouldApply,
} from '@/features/dashboard/logic';
import type { Order } from '@/features/dashboard/types';

function makeOrder(id: string): Order {
  return { id, customer: 'Ada Lovelace', amountCents: 1000 };
}

describe('dashboard logic', () => {
  it('only applies a snapshot with a strictly newer sequence', () => {
    expect(shouldApply(3, 4)).toBe(true);
    expect(shouldApply(3, 3)).toBe(false);
    expect(shouldApply(3, 2)).toBe(false);
  });

  it('appends to history and caps to the newest values', () => {
    expect(appendHistory([1, 2, 3], 4, 5)).toEqual([1, 2, 3, 4]);
    expect(appendHistory([1, 2, 3, 4, 5], 6, 5)).toEqual([2, 3, 4, 5, 6]);
  });

  it('does not mutate the history it is given', () => {
    const history = [1, 2];
    appendHistory(history, 3, 5);
    expect(history).toEqual([1, 2]);
  });

  it('prepends new orders, dedupes by id and caps the list', () => {
    const previous = [makeOrder('a')];
    const merged = mergeOrders(previous, [makeOrder('b'), makeOrder('c')], 8);
    expect(merged.map((order) => order.id)).toEqual(['b', 'c', 'a']);
  });

  it('returns the same array reference when nothing new arrives', () => {
    const previous = [makeOrder('a')];
    expect(mergeOrders(previous, [], 8)).toBe(previous);
    expect(mergeOrders(previous, [makeOrder('a')], 8)).toBe(previous);
  });

  it('drops the oldest orders once the cap is exceeded', () => {
    const previous = [makeOrder('a'), makeOrder('b')];
    const merged = mergeOrders(previous, [makeOrder('c')], 2);
    expect(merged.map((order) => order.id)).toEqual(['c', 'a']);
  });

  it('compares widget data by value, not identity', () => {
    expect(
      salesEqual(
        { totalCents: 1, orderCount: 2, changePct: 3 },
        { totalCents: 1, orderCount: 2, changePct: 3 },
      ),
    ).toBe(true);
    expect(
      salesEqual(
        { totalCents: 1, orderCount: 2, changePct: 3 },
        { totalCents: 9, orderCount: 2, changePct: 3 },
      ),
    ).toBe(false);
    expect(activeUsersEqual({ current: 5, history: [1, 2] }, { current: 5, history: [1, 2] })).toBe(
      true,
    );
    expect(activeUsersEqual({ current: 5, history: [1, 2] }, { current: 5, history: [1, 3] })).toBe(
      false,
    );
  });
});
