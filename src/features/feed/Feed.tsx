import { useEffect, useLayoutEffect } from 'react';
import { useFeedStore } from '@/features/feed/store';
import { useInfiniteScroll } from '@/features/feed/useInfiniteScroll';
import PostCard from '@/features/feed/PostCard';

export default function Feed() {
  const posts = useFeedStore((state) => state.posts);
  const status = useFeedStore((state) => state.status);
  const loadNext = useFeedStore((state) => state.loadNext);
  const retry = useFeedStore((state) => state.retry);
  const setScrollY = useFeedStore((state) => state.setScrollY);

  useEffect(() => {
    const { posts: loaded, status: current } = useFeedStore.getState();
    if (current === 'idle' && loaded.length === 0) void loadNext();
  }, [loadNext]);

  useLayoutEffect(() => {
    window.scrollTo(0, useFeedStore.getState().scrollY);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [setScrollY]);

  const sentinelRef = useInfiniteScroll(loadNext, status === 'idle');

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Infinite Feed</h1>

      <ul className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>

      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <div className="py-8 text-center text-sm text-slate-500">
        {status === 'loading' && <p role="status">Loading more posts…</p>}
        {status === 'error' && (
          <div role="alert" className="space-y-3">
            <p className="text-red-600">Something went wrong loading the feed.</p>
            <button
              type="button"
              onClick={() => void retry()}
              className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
            >
              Retry
            </button>
          </div>
        )}
        {status === 'end' && <p>You&rsquo;ve reached the end.</p>}
      </div>
    </section>
  );
}
