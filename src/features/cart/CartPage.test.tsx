import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartPage from '@/pages/CartPage';
import { useCartStore } from '@/features/cart/store';
import type { Product } from '@/features/cart/types';

const products: Product[] = [
  { id: 1, title: 'Alpha', price: 10.1, stock: 2, thumbnail: 'a.jpg' },
  { id: 2, title: 'Beta', price: 5, stock: 10, thumbnail: 'b.jpg' },
];

beforeEach(() => {
  useCartStore.setState({ lines: [] });
  localStorage.clear();
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ products }) }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CartPage', () => {
  it('shows the empty state, then recomputes totals as quantity changes', async () => {
    const user = userEvent.setup();
    render(<CartPage />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

    // Wait for the fetched products to render, then add the first (Alpha).
    const addButtons = await screen.findAllByRole('button', { name: /add to cart/i });
    await user.click(addButtons[0]);

    // Adding a line replaces the empty state with the cart contents.
    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();

    // Line total for 1 x 10.10 = 10.10; subtotal 10.10.
    const subtotal = screen.getByText('Subtotal').closest('div') as HTMLElement;
    expect(within(subtotal).getByText('$10.10')).toBeInTheDocument();

    // Increase to 2 -> subtotal 20.20, tax round(2020*0.18)=364 -> 3.64, total 23.84.
    await user.click(screen.getByRole('button', { name: /increase quantity of alpha/i }));
    await waitFor(() => {
      expect(within(subtotal).getByText('$20.20')).toBeInTheDocument();
    });
    const tax = screen.getByText('Tax (18%)').closest('div') as HTMLElement;
    expect(within(tax).getByText('$3.64')).toBeInTheDocument();
    const total = screen.getByText('Total').closest('div') as HTMLElement;
    expect(within(total).getByText('$23.84')).toBeInTheDocument();

    // The + button is disabled at stock (2), so quantity cannot exceed it.
    expect(screen.getByRole('button', { name: /increase quantity of alpha/i })).toBeDisabled();
  });
});
