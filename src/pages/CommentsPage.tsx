import Comments from '@/features/comments/Comments';

export default function CommentsPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Comments</h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-600">
        Post a comment and it appears instantly. If the network is slow, flaky, or offline, comments
        are queued and retried in order until the server confirms them — without ever duplicating.
      </p>
      <Comments />
    </section>
  );
}
