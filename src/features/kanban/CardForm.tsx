import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CardDraft } from '@/features/kanban/types';

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CardFormProps {
  defaultValues?: CardDraft;
  submitLabel: string;
  onSubmit: (draft: CardDraft) => void;
  onCancel: () => void;
}

export default function CardForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: CardFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      title: values.title,
      description: values.description ? values.description : undefined,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-2 rounded-md border border-slate-200 bg-white p-3">
      <div>
        <label htmlFor={titleId} className="sr-only">
          Title
        </label>
        <input
          id={titleId}
          autoFocus
          placeholder="Card title"
          className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
          {...register('title')}
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor={descriptionId} className="sr-only">
          Description
        </label>
        <textarea
          id={descriptionId}
          placeholder="Description (optional)"
          rows={2}
          className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
          {...register('description')}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-700"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
