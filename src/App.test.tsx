import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App shell', () => {
  it('renders the home page with a link to every feature route', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /frontend interview prep/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /q1 cart/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /q5 comments/i })).toBeInTheDocument();
  });

  it('navigates to a feature route and shows its brief', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('link', { name: /q3 kanban/i }));
    expect(screen.getByRole('heading', { name: /kanban board/i })).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown route', () => {
    renderAt('/nope');
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
