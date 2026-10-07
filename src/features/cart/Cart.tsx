import { useCartStore } from '@/features/cart/store';
import { computeTotals } from '@/features/cart/logic';
import { formatCents, toCents } from '@/features/cart/money';

/** The cart panel: line items with quantity controls, plus the running totals. */
export default function Cart() {
  const lines = useCartStore((state) => state.lines);
  const setItemQuantity = useCartStore((state) => state.setItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
        Your cart is empty. Add a product to get started.
      </div>
    );
  }

  const totals = computeTotals(lines);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <ul className="divide-y divide-slate-100">
        {lines.map((line) => {
          const atMax = line.quantity >= line.product.stock;
          const lineCents = toCents(line.product.price) * line.quantity;
          return (
            <li key={line.product.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{line.product.title}</p>
                <p className="text-xs text-slate-500">
                  ${formatCents(toCents(line.product.price))} each
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${line.product.title}`}
                  onClick={() => setItemQuantity(line.product.id, line.quantity - 1)}
                  className="h-7 w-7 rounded border border-slate-300 text-sm hover:bg-slate-100"
                >
                  −
                </button>
                <span
                  aria-label={`Quantity of ${line.product.title}`}
                  className="w-8 text-center text-sm tabular-nums"
                >
                  {line.quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${line.product.title}`}
                  onClick={() => setItemQuantity(line.product.id, line.quantity + 1)}
                  disabled={atMax}
                  className="h-7 w-7 rounded border border-slate-300 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className="w-20 text-right text-sm font-medium tabular-nums">
                ${formatCents(lineCents)}
              </span>
              <button
                type="button"
                aria-label={`Remove ${line.product.title}`}
                onClick={() => removeItem(line.product.id)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <dl className="mt-4 space-y-1 border-t border-slate-200 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="tabular-nums">${formatCents(totals.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-600">Tax (18%)</dt>
          <dd className="tabular-nums">${formatCents(totals.taxCents)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">${formatCents(totals.totalCents)}</dd>
        </div>
      </dl>
    </div>
  );
}
