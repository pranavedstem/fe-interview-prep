import type { Product } from '@/features/cart/types';
import { formatCents, toCents } from '@/features/cart/money';

interface ProductListProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

/** Grid of products, each with an Add-to-cart button (disabled when out of stock). */
export default function ProductList({ products, onAdd }: ProductListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {products.map((product) => {
        const outOfStock = product.stock < 1;
        return (
          <li
            key={product.id}
            className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-20 w-20 flex-none rounded object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-semibold">{product.title}</span>
              <span className="text-slate-600">${formatCents(toCents(product.price))}</span>
              <span className="text-xs text-slate-500">{product.stock} in stock</span>
              <button
                type="button"
                onClick={() => onAdd(product)}
                disabled={outOfStock}
                className="mt-auto self-start rounded bg-slate-900 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {outOfStock ? 'Out of stock' : 'Add to cart'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
