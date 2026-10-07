import { Link } from 'react-router-dom';
import type { Post } from '@/features/feed/api';

export default function PostCard({ post }: { post: Post }) {
  return (
    <li>
      <Link
        to={`/feed/${post.id}`}
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
      >
        <h2 className="mb-1 text-lg font-semibold text-slate-900">{post.title}</h2>
        <p className="mb-3 line-clamp-2 text-sm text-slate-600">{post.body}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-0.5">
              #{tag}
            </span>
          ))}
          <span className="ml-auto">
            ♥ {post.reactions.likes} · {post.views} views
          </span>
        </div>
      </Link>
    </li>
  );
}
