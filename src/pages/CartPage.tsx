import Cart from '@/features/cart/Cart';
import ProductList from '@/features/cart/ProductList';
import { useProducts } from '@/features/cart/useProducts';
import { useCartStore } from '@/features/cart/store';

export default function CartPage() {
  const products = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
            Products
          </h2>
          {products.status === 'loading' && <p className="text-slate-500">Loading products…</p>}
          {products.status === 'error' && (
            <p className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
              {products.message}
            </p>
          )}
          {products.status === 'ready' && (
            <ProductList products={products.products} onAdd={addItem} />
          )}
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
            Cart
          </h2>
          <Cart />
        </div>
      </div>
    </section>
  );
}
