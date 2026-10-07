/** A product as returned by the dummyjson products API (only the fields we use). */
export interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
}

/** A line in the cart: the product snapshot plus the chosen quantity. */
export interface CartLine {
  product: Product;
  quantity: number;
}

/** Subtotal, tax and total, all expressed in integer cents to avoid float drift. */
export interface CartTotals {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}
