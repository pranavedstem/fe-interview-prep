import { describe, expect, it } from 'vitest';
import {
  createComment,
  markConfirmed,
  markFailed,
  markSending,
  nextPending,
} from '@/features/comments/logic';
import type { Comment } from '@/features/comments/types';

const draft = { author: 'Ada', body: 'Hello' };

describe('comment logic', () => {
  it('creates an optimistic comment in the sending state', () => {
    const comment = createComment(draft, 'c1', 100);
    expect(comment).toMatchObject({
      clientId: 'c1',
      author: 'Ada',
      body: 'Hello',
      status: 'sending',
      serverId: null,
      createdAt: 100,
    });
  });

  it('confirms a comment by client id and leaves the rest untouched', () => {
    const list = [createComment(draft, 'c1', 1), createComment(draft, 'c2', 2)];
    const next = markConfirmed(list, 'c1', 'srv-9');

    expect(next[0]).toMatchObject({ status: 'confirmed', serverId: 'srv-9' });
    expect(next[1].status).toBe('sending');
    expect(list[0].status).toBe('sending');
  });

  it('marks a comment failed, then back to sending on retry', () => {
    let list = [createComment(draft, 'c1', 1)];
    list = markFailed(list, 'c1');
    expect(list[0].status).toBe('failed');

    list = markSending(list, 'c1');
    expect(list[0].status).toBe('sending');
  });

  it('finds the first pending comment in order, skipping failed and confirmed', () => {
    const list: Comment[] = [
      { ...createComment(draft, 'c1', 1), status: 'confirmed' },
      { ...createComment(draft, 'c2', 2), status: 'failed' },
      createComment(draft, 'c3', 3),
      createComment(draft, 'c4', 4),
    ];
    expect(nextPending(list)?.clientId).toBe('c3');
  });

  it('reports no pending comment once everything is resolved', () => {
    const list: Comment[] = [
      { ...createComment(draft, 'c1', 1), status: 'confirmed' },
      { ...createComment(draft, 'c2', 2), status: 'failed' },
    ];
    expect(nextPending(list)).toBeUndefined();
  });
});
