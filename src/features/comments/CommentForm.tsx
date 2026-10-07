import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, type CommentDraft } from '@/features/comments/schema';
import { useCommentsStore } from '@/features/comments/store';
import { createComment, newClientId } from '@/features/comments/logic';

export default function CommentForm() {
  const add = useCommentsStore((state) => state.add);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentDraft>({
    resolver: zodResolver(commentSchema),
    defaultValues: { author: '', body: '' },
  });

  const onSubmit = (draft: CommentDraft) => {
    add(createComment(draft, newClientId(), Date.now()));
    reset({ author: draft.author, body: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <div>
        <label htmlFor="author" className="mb-1 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="author"
          {...register('author')}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.author && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.author.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="body" className="mb-1 block text-sm font-medium text-slate-700">
          Comment
        </label>
        <textarea
          id="body"
          rows={3}
          {...register('body')}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.body && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.body.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Post comment
      </button>
    </form>
  );
}
