/**
 * Money helpers. All arithmetic is done in integer cents so that sums like
 * 10.1 * 3 never accumulate binary-float error; prices only become floats again
 * at the moment they are formatted for display.
 */

/** Convert a decimal price (e.g. 10.1) to integer cents (1010), rounding. */
export function toCents(price: number): number {
  return Math.round(price * 100);
}

/** 18% tax on a cents amount, rounded to the nearest cent. */
export function taxCents(subtotalCents: number): number {
  return Math.round(subtotalCents * 0.18);
}

/** Format a cents amount as a currency string with exactly 2 decimal places. */
export function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}
