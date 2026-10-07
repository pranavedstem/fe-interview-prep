import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFeedStore } from '@/features/feed/store';
import { errorResponse, jsonResponse, makePage } from '@/features/feed/testUtils';

function skipOf(call: unknown[]): string | null {
  return new URL(String(call[0])).searchParams.get('skip');
}

describe('feed store', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    useFeedStore.getState().reset();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('never requests the same page twice when loadNext fires repeatedly', async () => {
    fetchMock.mockImplementation((input: string) =>
      Promise.resolve(jsonResponse(makePage(Number(new URL(input).searchParams.get('skip')), 251))),
    );

    const { loadNext } = useFeedStore.getState();
    await Promise.all([loadNext(), loadNext(), loadNext(), loadNext()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(skipOf(fetchMock.mock.calls[0])).toBe('0');

    await useFeedStore.getState().loadNext();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(skipOf(fetchMock.mock.calls[1])).toBe('10');

    const ids = useFeedStore.getState().posts.map((post) => post.id);
    expect(ids.length).toBe(20);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('moves to the error state on failure and recovers the same page on retry', async () => {
    fetchMock.mockResolvedValueOnce(errorResponse());
    await useFeedStore.getState().loadNext();
    expect(useFeedStore.getState().status).toBe('error');
    expect(useFeedStore.getState().posts).toHaveLength(0);

    fetchMock.mockResolvedValueOnce(jsonResponse(makePage(0, 251)));
    await useFeedStore.getState().retry();
    expect(useFeedStore.getState().status).toBe('idle');
    expect(useFeedStore.getState().posts).toHaveLength(10);
    expect(skipOf(fetchMock.mock.calls[1])).toBe('0');
  });

  it('reaches the end and stops requesting', async () => {
    fetchMock.mockImplementation((input: string) =>
      Promise.resolve(jsonResponse(makePage(Number(new URL(input).searchParams.get('skip')), 15))),
    );

    await useFeedStore.getState().loadNext();
    expect(useFeedStore.getState().status).toBe('idle');

    await useFeedStore.getState().loadNext();
    expect(useFeedStore.getState().status).toBe('end');
    expect(useFeedStore.getState().posts).toHaveLength(15);

    const callCount = fetchMock.mock.calls.length;
    await useFeedStore.getState().loadNext();
    expect(fetchMock.mock.calls).toHaveLength(callCount);
  });
});
