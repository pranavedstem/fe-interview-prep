import { z } from 'zod';

export const commentSchema = z.object({
  author: z.string().trim().min(1, 'Name is required').max(40, 'Name is too long'),
  body: z.string().trim().min(1, 'Comment cannot be empty').max(500, 'Comment is too long'),
});

export type CommentDraft = z.infer<typeof commentSchema>;
