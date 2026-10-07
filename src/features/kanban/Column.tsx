import { useState, type DragEvent } from 'react';
import clsx from 'clsx';
import type { ColumnId, DragState } from '@/features/kanban/types';
import { useKanbanStore } from '@/features/kanban/store';
import { dropIndex } from '@/features/kanban/logic';
import CardItem from '@/features/kanban/CardItem';
import CardForm from '@/features/kanban/CardForm';

function DropIndicator({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={clsx('my-0.5 h-1 rounded', active ? 'bg-slate-900' : 'bg-transparent')}
    />
  );
}

interface ColumnProps {
  column: { id: ColumnId; label: string };
  drag: DragState;
  beginDrag: (cardId: string) => void;
  hover: (column: ColumnId, boundary: number) => void;
  endDrag: () => void;
}

export default function Column({ column, drag, beginDrag, hover, endDrag }: ColumnProps) {
  const cards = useKanbanStore((state) => state.board[column.id]);
  const addCard = useKanbanStore((state) => state.addCard);
  const moveCard = useKanbanStore((state) => state.moveCard);
  const [composing, setComposing] = useState(false);

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const { dragId, indicator } = drag;
    if (dragId && indicator && indicator.column === column.id) {
      const board = useKanbanStore.getState().board;
      moveCard(dragId, column.id, dropIndex(board, dragId, column.id, indicator.boundary));
    }
    endDrag();
  };

  const indicatorAt = (boundary: number) =>
    drag.dragId !== null &&
    drag.indicator?.column === column.id &&
    drag.indicator.boundary === boundary;

  return (
    <section
      aria-label={column.label}
      className="flex flex-col rounded-lg bg-slate-100 p-3"
      onDragOver={(event) => {
        if (drag.dragId) {
          event.preventDefault();
          hover(column.id, cards.length);
        }
      }}
      onDrop={handleDrop}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{column.label}</h2>
        <span
          aria-label={`${cards.length} cards`}
          className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
        >
          {cards.length}
        </span>
      </header>

      <ul className="flex flex-1 flex-col">
        {cards.map((card, index) => (
          <li key={card.id}>
            <DropIndicator active={indicatorAt(index)} />
            <CardItem
              card={card}
              columnId={column.id}
              index={index}
              count={cards.length}
              dragging={drag.dragId === card.id}
              onDragStart={() => beginDrag(card.id)}
              onDragEnd={endDrag}
              onHoverHalf={(half) => hover(column.id, index + half)}
            />
          </li>
        ))}
        <DropIndicator active={indicatorAt(cards.length)} />
      </ul>

      {composing ? (
        <div className="mt-2">
          <CardForm
            submitLabel="Add card"
            onSubmit={(draft) => {
              addCard(column.id, draft);
              setComposing(false);
            }}
            onCancel={() => setComposing(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="mt-2 rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          + Add card
        </button>
      )}
    </section>
  );
}
