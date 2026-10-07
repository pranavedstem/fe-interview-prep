import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Post } from '@/features/feed/api';
import { fetchPost } from '@/features/feed/api';

type DetailState = { status: 'loading' } | { status: 'error' } | { status: 'loaded'; post: Post };

export default function PostDetail() {
  const { postId } = useParams();
  const id = Number(postId);
  const [state, setState] = useState<DetailState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setState({ status: 'error' });
      return;
    }
    const controller = new AbortController();
    setState({ status: 'loading' });
    fetchPost(id, controller.signal)
      .then((post) => setState({ status: 'loaded', post }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'error' });
      });
    return () => controller.abort();
  }, [id, attempt]);

  return (
    <section>
      <Link to="/feed" className="mb-6 inline-block text-sm text-slate-600 hover:text-slate-900">
        ← Back to feed
      </Link>

      {state.status === 'loading' && <p role="status">Loading post…</p>}

      {state.status === 'error' && (
        <div role="alert" className="space-y-3">
          <p className="text-red-600">Could not load this post.</p>
          <button
            type="button"
            onClick={() => setAttempt((count) => count + 1)}
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === 'loaded' && (
        <article className="rounded-lg border border-slate-200 bg-white p-6">
          <h1 className="mb-4 text-2xl font-bold text-slate-900">{state.post.title}</h1>
          <p className="mb-6 whitespace-pre-line text-slate-700">{state.post.body}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {state.post.tags.map((tag) => (
              <span key={tag} className="rounded bg-slate-100 px-2 py-0.5">
                #{tag}
              </span>
            ))}
            <span className="ml-auto">
              ♥ {state.post.reactions.likes} · {state.post.views} views
            </span>
          </div>
        </article>
      )}
    </section>
  );
}
