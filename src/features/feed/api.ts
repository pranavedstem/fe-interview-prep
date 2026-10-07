import { z } from 'zod';

export const PAGE_SIZE = 10;

const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  reactions: z.object({ likes: z.number(), dislikes: z.number() }),
  views: z.number(),
  userId: z.number(),
});

const postsPageSchema = z.object({
  posts: z.array(postSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Post = z.infer<typeof postSchema>;
export type PostsPage = z.infer<typeof postsPageSchema>;

const BASE_URL = 'https://dummyjson.com/posts';

export async function fetchPostsPage(
  skip: number,
  limit: number,
  signal?: AbortSignal,
): Promise<PostsPage> {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`, { signal });
  if (!response.ok) throw new Error(`Failed to load posts (${response.status})`);
  return postsPageSchema.parse(await response.json());
}

export async function fetchPost(id: number, signal?: AbortSignal): Promise<Post> {
  const response = await fetch(`${BASE_URL}/${id}`, { signal });
  if (!response.ok) throw new Error(`Failed to load post ${id} (${response.status})`);
  return postSchema.parse(await response.json());
}
