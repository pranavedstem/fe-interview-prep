import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Feed from '@/features/feed/Feed';
import { useFeedStore } from '@/features/feed/store';
import { errorResponse, jsonResponse, makePage } from '@/features/feed/testUtils';

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function renderFeed() {
  return render(
    <MemoryRouter>
      <Feed />
    </MemoryRouter>,
  );
}

describe('Feed', () => {
  beforeEach(() => {
    useFeedStore.getState().reset();
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('loads the first page and links each post to its detail page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(makePage(0, 251))));
    renderFeed();

    const link = await screen.findByRole('link', { name: /^Post 1\b/ });
    expect(link).toHaveAttribute('href', '/feed/1');
  });

  it('shows an error with a retry that recovers the feed', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(errorResponse())
      .mockResolvedValueOnce(jsonResponse(makePage(0, 251)));
    vi.stubGlobal('fetch', fetchMock);
    renderFeed();

    await userEvent.click(await screen.findByRole('button', { name: /retry/i }));
    expect(await screen.findByRole('link', { name: /^Post 1\b/ })).toBeInTheDocument();
  });

  it('shows the end-of-feed message when the last page is loaded', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(makePage(0, 5))));
    renderFeed();

    expect(await screen.findByText(/reached the end/i)).toBeInTheDocument();
  });
});
