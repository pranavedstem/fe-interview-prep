import type { Post, PostsPage } from '@/features/feed/api';

export function makePost(id: number): Post {
  return {
    id,
    title: `Post ${id}`,
    body: `Body of post ${id}`,
    tags: ['tag'],
    reactions: { likes: id, dislikes: 0 },
    views: id,
    userId: 1,
  };
}

export function makePage(skip: number, total: number): PostsPage {
  const count = Math.min(10, Math.max(0, total - skip));
  const posts = Array.from({ length: count }, (_, index) => makePost(skip + index + 1));
  return { posts, total, skip, limit: 10 };
}

export function jsonResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

export function errorResponse(status = 500): Response {
  return { ok: false, status, json: async () => ({}) } as Response;
}
