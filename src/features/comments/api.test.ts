import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { postComment } from '@/features/comments/api';

const MAX_DELAY = 2000;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('comments api', () => {
  it('returns the same server id when the same client id is sent twice', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const input = { clientId: 'c-idempotent', author: 'Ada', body: 'Hi' };

    const firstPromise = postComment(input);
    await vi.advanceTimersByTimeAsync(MAX_DELAY);
    const first = await firstPromise;

    const secondPromise = postComment(input);
    await vi.advanceTimersByTimeAsync(MAX_DELAY);
    const second = await secondPromise;

    expect(second.serverId).toBe(first.serverId);
  });

  it('rejects when the service fails', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const assertion = expect(
      postComment({ clientId: 'c-fail', author: 'Ada', body: 'Hi' }),
    ).rejects.toThrow(/unavailable/i);
    await vi.advanceTimersByTimeAsync(MAX_DELAY);
    await assertion;
  });
});
