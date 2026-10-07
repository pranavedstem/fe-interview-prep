import { create } from 'zustand';
import type { Post } from '@/features/feed/api';
import { PAGE_SIZE, fetchPostsPage } from '@/features/feed/api';

export type FeedStatus = 'idle' | 'loading' | 'error' | 'end';

interface FeedState {
  posts: Post[];
  nextSkip: number;
  total: number | null;
  status: FeedStatus;
  scrollY: number;
  loadNext: () => Promise<void>;
  retry: () => Promise<void>;
  setScrollY: (y: number) => void;
  reset: () => void;
}

const initialState = {
  posts: [] as Post[],
  nextSkip: 0,
  total: null as number | null,
  status: 'idle' as FeedStatus,
  scrollY: 0,
};

export const useFeedStore = create<FeedState>((set, get) => ({
  ...initialState,
  loadNext: async () => {
    const { status, nextSkip, posts } = get();
    if (status === 'loading' || status === 'end') return;
    set({ status: 'loading' });
    try {
      const page = await fetchPostsPage(nextSkip, PAGE_SIZE);
      const seen = new Set(posts.map((post) => post.id));
      const merged = [...posts, ...page.posts.filter((post) => !seen.has(post.id))];
      const reachedEnd = page.posts.length === 0 || merged.length >= page.total;
      set({
        posts: merged,
        nextSkip: nextSkip + PAGE_SIZE,
        total: page.total,
        status: reachedEnd ? 'end' : 'idle',
      });
    } catch {
      set({ status: 'error' });
    }
  },
  retry: async () => {
    if (get().status !== 'error') return;
    set({ status: 'idle' });
    await get().loadNext();
  },
  setScrollY: (y) => set({ scrollY: y }),
  reset: () => set({ ...initialState }),
}));
