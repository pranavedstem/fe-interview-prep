import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine, Product } from '@/features/cart/types';
import { addLine, removeLine, setQuantity } from '@/features/cart/logic';

interface CartState {
  lines: CartLine[];
  addItem: (product: Product) => void;
  setItemQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (product) => set((state) => ({ lines: addLine(state.lines, product) })),
      setItemQuantity: (productId, quantity) =>
        set((state) => ({ lines: setQuantity(state.lines, productId, quantity) })),
      removeItem: (productId) => set((state) => ({ lines: removeLine(state.lines, productId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'q1-cart' },
  ),
);
