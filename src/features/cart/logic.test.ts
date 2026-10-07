import { describe, expect, it } from 'vitest';
import type { CartLine, Product } from '@/features/cart/types';
import { addLine, clampQuantity, computeTotals, removeLine, setQuantity } from '@/features/cart/logic';
import { formatCents } from '@/features/cart/money';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return { id: 1, title: 'Widget', price: 10, stock: 5, thumbnail: '', ...overrides };
}

describe('cart logic', () => {
  it('adds a new product with quantity 1', () => {
    const lines = addLine([], makeProduct());
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(1);
  });

  it('bumps quantity when adding an existing product, clamped to stock', () => {
    const product = makeProduct({ stock: 2 });
    let lines: CartLine[] = addLine([], product);
    lines = addLine(lines, product);
    lines = addLine(lines, product); // third add exceeds stock of 2
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(2);
  });

  it('clamps an explicit quantity to stock and removes below 1', () => {
    expect(clampQuantity(99, 5)).toBe(5);
    expect(clampQuantity(0, 5)).toBe(1);

    const product = makeProduct({ stock: 3 });
    let lines = addLine([], product);
    lines = setQuantity(lines, product.id, 10);
    expect(lines[0].quantity).toBe(3);
    lines = setQuantity(lines, product.id, 0);
    expect(lines).toHaveLength(0);
  });

  it('removes a line', () => {
    const lines = addLine([], makeProduct());
    expect(removeLine(lines, 1)).toHaveLength(0);
  });

  it('recomputes subtotal, 18% tax and total correctly', () => {
    const lines: CartLine[] = [
      { product: makeProduct({ id: 1, price: 10, stock: 10 }), quantity: 2 },
      { product: makeProduct({ id: 2, price: 5, stock: 10 }), quantity: 1 },
    ];
    const totals = computeTotals(lines); // subtotal 25.00, tax 4.50, total 29.50
    expect(formatCents(totals.subtotalCents)).toBe('25.00');
    expect(formatCents(totals.taxCents)).toBe('4.50');
    expect(formatCents(totals.totalCents)).toBe('29.50');
  });

  it('is exact for prices that would drift in float math (10.1 x 3)', () => {
    // 10.1 * 3 === 30.299999999999997 in float; integer cents keeps it exact.
    const lines: CartLine[] = [
      { product: makeProduct({ id: 1, price: 10.1, stock: 10 }), quantity: 3 },
    ];
    const totals = computeTotals(lines);
    expect(formatCents(totals.subtotalCents)).toBe('30.30');
    expect(formatCents(totals.taxCents)).toBe('5.45'); // round(3030 * 0.18) = 545
    expect(formatCents(totals.totalCents)).toBe('35.75');
  });
});
