import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PostDetail from '@/features/feed/PostDetail';
import { errorResponse, jsonResponse, makePost } from '@/features/feed/testUtils';

function renderDetail(id: string, fetchImpl: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetchImpl);
  return render(
    <MemoryRouter initialEntries={[`/feed/${id}`]}>
      <Routes>
        <Route path="/feed" element={<p>Feed list</p>} />
        <Route path="/feed/:postId" element={<PostDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PostDetail', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', class {});
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('loads and renders the requested post', async () => {
    renderDetail('1', vi.fn().mockResolvedValue(jsonResponse(makePost(1))));
    expect(await screen.findByRole('heading', { name: 'Post 1' })).toBeInTheDocument();
  });

  it('shows an error with a retry that recovers the post', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(errorResponse())
      .mockResolvedValueOnce(jsonResponse(makePost(1)));
    renderDetail('1', fetchMock);

    await userEvent.click(await screen.findByRole('button', { name: /retry/i }));
    expect(await screen.findByRole('heading', { name: 'Post 1' })).toBeInTheDocument();
  });

  it('links back to the feed', async () => {
    renderDetail('1', vi.fn().mockResolvedValue(jsonResponse(makePost(1))));
    expect(await screen.findByRole('link', { name: /back to feed/i })).toHaveAttribute(
      'href',
      '/feed',
    );
  });
});
