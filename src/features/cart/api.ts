import type { Product } from '@/features/cart/types';

interface ProductsResponse {
  products: Product[];
}

/** Fetch a page of products from the dummyjson API. Throws on a non-OK response. */
export async function fetchProducts(limit = 20): Promise<Product[]> {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`);
  }
  const data: ProductsResponse = await response.json();
  return data.products;
}
