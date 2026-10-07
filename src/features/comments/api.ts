import type { ServerComment } from '@/features/comments/types';

interface PostCommentInput {
  clientId: string;
  author: string;
  body: string;
}

const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 2000;
const FAILURE_RATE = 0.2;

const serverComments = new Map<string, ServerComment>();
let nextServerId = 1;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function postComment(input: PostCommentInput): Promise<ServerComment> {
  await delay(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));

  let saved = serverComments.get(input.clientId);
  if (!saved) {
    saved = {
      serverId: `srv-${nextServerId++}`,
      clientId: input.clientId,
      author: input.author,
      body: input.body,
    };
    serverComments.set(input.clientId, saved);
  }

  if (Math.random() < FAILURE_RATE) {
    throw new Error('The comment service is unavailable. Please retry.');
  }

  return saved;
}
