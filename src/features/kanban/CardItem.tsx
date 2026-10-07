import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import type { Card, ColumnId } from '@/features/kanban/types';
import { COLUMNS } from '@/features/kanban/types';
import { useKanbanStore } from '@/features/kanban/store';
import CardForm from '@/features/kanban/CardForm';

interface MoveButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

function MoveButton({ label, disabled, onClick, children }: MoveButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

interface CardItemProps {
  card: Card;
  columnId: ColumnId;
  index: number;
  count: number;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onHoverHalf: (half: number) => void;
}

export default function CardItem({
  card,
  columnId,
  index,
  count,
  dragging,
  onDragStart,
  onDragEnd,
  onHoverHalf,
}: CardItemProps) {
  const editCard = useKanbanStore((state) => state.editCard);
  const deleteCard = useKanbanStore((state) => state.deleteCard);
  const moveCard = useKanbanStore((state) => state.moveCard);
  const [editing, setEditing] = useState(false);

  const columnIndex = COLUMNS.findIndex((column) => column.id === columnId);
  const previousColumn = COLUMNS[columnIndex - 1]?.id;
  const nextColumn = COLUMNS[columnIndex + 1]?.id;

  if (editing) {
    return (
      <CardForm
        defaultValues={{ title: card.title, description: card.description }}
        submitLabel="Save"
        onSubmit={(draft) => {
          editCard(card.id, draft);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', card.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        onHoverHalf(event.clientY - rect.top < rect.height / 2 ? 0 : 1);
      }}
      className={clsx(
        'rounded-md border border-slate-200 bg-white p-3 shadow-sm',
        dragging && 'opacity-50',
      )}
    >
      <p className="text-sm font-medium break-words text-slate-900">{card.title}</p>
      {card.description && (
        <p className="mt-1 text-xs break-words text-slate-500">{card.description}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <MoveButton
          label="Move up"
          disabled={index === 0}
          onClick={() => moveCard(card.id, columnId, index - 1)}
        >
          ↑
        </MoveButton>
        <MoveButton
          label="Move down"
          disabled={index === count - 1}
          onClick={() => moveCard(card.id, columnId, index + 1)}
        >
          ↓
        </MoveButton>
        <MoveButton
          label="Move to previous column"
          disabled={previousColumn === undefined}
          onClick={() =>
            previousColumn && moveCard(card.id, previousColumn, Number.MAX_SAFE_INTEGER)
          }
        >
          ←
        </MoveButton>
        <MoveButton
          label="Move to next column"
          disabled={nextColumn === undefined}
          onClick={() => nextColumn && moveCard(card.id, nextColumn, Number.MAX_SAFE_INTEGER)}
        >
          →
        </MoveButton>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="ml-auto rounded px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteCard(card.id)}
          className="rounded px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
