import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ServerComment } from '@/features/comments/types';

const { postCommentMock } = vi.hoisted(() => ({ postCommentMock: vi.fn() }));
vi.mock('@/features/comments/api', () => ({ postComment: postCommentMock }));

import CommentsPage from '@/pages/CommentsPage';
import { useCommentsStore } from '@/features/comments/store';

interface PostInput {
  clientId: string;
  author: string;
  body: string;
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value });
}

async function post(user: ReturnType<typeof userEvent.setup>, author: string, body: string) {
  await user.clear(screen.getByLabelText(/name/i));
  await user.type(screen.getByLabelText(/name/i), author);
  await user.type(screen.getByLabelText(/comment/i), body);
  await user.click(screen.getByRole('button', { name: /post comment/i }));
}

beforeEach(() => {
  localStorage.clear();
  useCommentsStore.setState({ comments: [] });
  postCommentMock.mockReset();
  setOnline(true);
});

afterEach(() => {
  setOnline(true);
});

describe('CommentsPage', () => {
  it('queues comments while offline and sends them in order, with no duplicates, when back online', async () => {
    const user = userEvent.setup();
    setOnline(false);
    postCommentMock.mockImplementation((input: PostInput): Promise<ServerComment> =>
      Promise.resolve({ serverId: `srv-${input.clientId}`, ...input }),
    );

    render(<CommentsPage />);

    await post(user, 'Ada', 'first');
    await post(user, 'Ada', 'second');
    await post(user, 'Ada', 'third');

    expect(postCommentMock).not.toHaveBeenCalled();
    expect(screen.getAllByText('Queued (offline)')).toHaveLength(3);

    await act(async () => {
      setOnline(true);
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => expect(postCommentMock).toHaveBeenCalledTimes(3));

    const bodies = postCommentMock.mock.calls.map((call) => (call[0] as PostInput).body);
    expect(bodies).toEqual(['first', 'second', 'third']);

    const clientIds = postCommentMock.mock.calls.map((call) => (call[0] as PostInput).clientId);
    expect(new Set(clientIds).size).toBe(3);

    await waitFor(() => expect(screen.getAllByText('Posted')).toHaveLength(3));
  });

  it('shows a failed comment with a retry that re-sends the same client id', async () => {
    const user = userEvent.setup();
    postCommentMock
      .mockRejectedValueOnce(new Error('nope'))
      .mockImplementation((input: PostInput): Promise<ServerComment> =>
        Promise.resolve({ serverId: 'srv-1', ...input }),
      );

    render(<CommentsPage />);
    await post(user, 'Ada', 'hello');

    const retry = await screen.findByRole('button', { name: /retry/i });
    expect(screen.getByText(/failed to send/i)).toBeInTheDocument();

    await user.click(retry);

    await waitFor(() => expect(screen.getByText('Posted')).toBeInTheDocument());

    const clientIds = postCommentMock.mock.calls.map((call) => (call[0] as PostInput).clientId);
    expect(clientIds[0]).toBe(clientIds[1]);
  });

  it('rejects an empty comment with a validation message and sends nothing', async () => {
    const user = userEvent.setup();
    render(<CommentsPage />);

    await user.click(screen.getByRole('button', { name: /post comment/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/comment cannot be empty/i)).toBeInTheDocument();
    expect(postCommentMock).not.toHaveBeenCalled();
  });

  it('persists queued comments to storage so they survive a refresh', async () => {
    const user = userEvent.setup();
    setOnline(false);

    render(<CommentsPage />);
    await post(user, 'Ada', 'persist me');
    expect(screen.getByText('persist me')).toBeInTheDocument();

    const raw = localStorage.getItem('q5-comments') ?? '{}';
    const stored = JSON.parse(raw) as {
      state: { comments: Array<{ body: string; status: string }> };
    };
    const persisted = stored.state.comments.find((comment) => comment.body === 'persist me');
    expect(persisted).toBeDefined();
    expect(persisted?.status).toBe('sending');
  });
});
