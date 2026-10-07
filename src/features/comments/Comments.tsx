import clsx from 'clsx';
import CommentForm from '@/features/comments/CommentForm';
import { useCommentsStore } from '@/features/comments/store';
import { useCommentSync } from '@/features/comments/useCommentSync';
import type { Comment } from '@/features/comments/types';

function statusLabel(comment: Comment, online: boolean): string {
  if (comment.status === 'confirmed') return 'Posted';
  if (comment.status === 'failed') return 'Failed to send';
  return online ? 'Sending…' : 'Queued (offline)';
}

export default function Comments() {
  const comments = useCommentsStore((state) => state.comments);
  const retry = useCommentsStore((state) => state.retry);
  const { online } = useCommentSync();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span
            aria-hidden
            className={clsx('h-2.5 w-2.5 rounded-full', online ? 'bg-green-500' : 'bg-slate-400')}
          />
          <span className="font-medium text-slate-600">{online ? 'Online' : 'Offline'}</span>
        </div>
        <CommentForm />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Thread
        </h2>
        {comments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
            No comments yet. Be the first to post.
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                key={comment.clientId}
                className={clsx(
                  'rounded-lg border bg-white p-4',
                  comment.status === 'failed' ? 'border-red-200' : 'border-slate-200',
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium text-slate-800">{comment.author}</p>
                  <span
                    className={clsx(
                      'shrink-0 text-xs font-semibold',
                      comment.status === 'confirmed' && 'text-green-600',
                      comment.status === 'failed' && 'text-red-600',
                      comment.status === 'sending' && 'text-slate-400',
                    )}
                  >
                    {statusLabel(comment, online)}
                  </span>
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">{comment.body}</p>
                {comment.status === 'failed' && (
                  <button
                    type="button"
                    onClick={() => retry(comment.clientId)}
                    className="mt-2 text-xs font-semibold text-slate-900 underline hover:text-slate-600"
                  >
                    Retry
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
