import type { Comment } from '@/features/comments/types';
import type { CommentDraft } from '@/features/comments/schema';

export function newClientId(): string {
  return crypto.randomUUID();
}

export function createComment(draft: CommentDraft, clientId: string, createdAt: number): Comment {
  return {
    clientId,
    author: draft.author,
    body: draft.body,
    status: 'sending',
    serverId: null,
    createdAt,
  };
}

export function markConfirmed(comments: Comment[], clientId: string, serverId: string): Comment[] {
  return comments.map((comment) =>
    comment.clientId === clientId ? { ...comment, status: 'confirmed', serverId } : comment,
  );
}

export function markFailed(comments: Comment[], clientId: string): Comment[] {
  return comments.map((comment) =>
    comment.clientId === clientId ? { ...comment, status: 'failed' } : comment,
  );
}

export function markSending(comments: Comment[], clientId: string): Comment[] {
  return comments.map((comment) =>
    comment.clientId === clientId ? { ...comment, status: 'sending' } : comment,
  );
}

export function nextPending(comments: Comment[]): Comment | undefined {
  return comments.find((comment) => comment.status === 'sending');
}
