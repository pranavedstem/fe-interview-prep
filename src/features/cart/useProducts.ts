import { useEffect, useState } from 'react';
import type { Product } from '@/features/cart/types';
import { fetchProducts } from '@/features/cart/api';

type ProductsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; products: Product[] };

/** Fetch products once on mount, exposing loading / error / ready states. */
export function useProducts(): ProductsState {
  const [state, setState] = useState<ProductsState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    fetchProducts()
      .then((products) => {
        if (active) setState({ status: 'ready', products });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Failed to load products';
        setState({ status: 'error', message });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
