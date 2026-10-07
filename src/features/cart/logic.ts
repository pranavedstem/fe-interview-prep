import type { CartLine, CartTotals, Product } from '@/features/cart/types';
import { taxCents, toCents } from '@/features/cart/money';

/** Clamp a desired quantity into the valid range [1, stock]. */
export function clampQuantity(quantity: number, stock: number): number {
  if (quantity < 1) return 1;
  if (quantity > stock) return stock;
  return quantity;
}

/**
 * Add a product to the lines (or bump its quantity if already present),
 * clamping the result to the product's stock. Returns a new array.
 */
export function addLine(lines: CartLine[], product: Product): CartLine[] {
  const existing = lines.find((line) => line.product.id === product.id);
  if (!existing) {
    return [...lines, { product, quantity: clampQuantity(1, product.stock) }];
  }
  return lines.map((line) =>
    line.product.id === product.id
      ? { ...line, quantity: clampQuantity(line.quantity + 1, product.stock) }
      : line,
  );
}

/**
 * Set an explicit quantity for a product. A quantity below 1 removes the line;
 * otherwise it is clamped to stock. Returns a new array.
 */
export function setQuantity(lines: CartLine[], productId: number, quantity: number): CartLine[] {
  if (quantity < 1) return removeLine(lines, productId);
  return lines.map((line) =>
    line.product.id === productId
      ? { ...line, quantity: clampQuantity(quantity, line.product.stock) }
      : line,
  );
}

/** Remove a product's line entirely. Returns a new array. */
export function removeLine(lines: CartLine[], productId: number): CartLine[] {
  return lines.filter((line) => line.product.id !== productId);
}

/** Compute subtotal, 18% tax and total, all in integer cents. */
export function computeTotals(lines: CartLine[]): CartTotals {
  const subtotalCents = lines.reduce(
    (sum, line) => sum + toCents(line.product.price) * line.quantity,
    0,
  );
  const tax = taxCents(subtotalCents);
  return { subtotalCents, taxCents: tax, totalCents: subtotalCents + tax };
}
