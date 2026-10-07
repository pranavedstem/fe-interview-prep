import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Comment } from '@/features/comments/types';
import { markConfirmed, markFailed, markSending } from '@/features/comments/logic';

interface CommentsState {
  comments: Comment[];
  add: (comment: Comment) => void;
  confirm: (clientId: string, serverId: string) => void;
  fail: (clientId: string) => void;
  retry: (clientId: string) => void;
}

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set) => ({
      comments: [],
      add: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
      confirm: (clientId, serverId) =>
        set((state) => ({ comments: markConfirmed(state.comments, clientId, serverId) })),
      fail: (clientId) => set((state) => ({ comments: markFailed(state.comments, clientId) })),
      retry: (clientId) => set((state) => ({ comments: markSending(state.comments, clientId) })),
    }),
    { name: 'q5-comments' },
  ),
);
