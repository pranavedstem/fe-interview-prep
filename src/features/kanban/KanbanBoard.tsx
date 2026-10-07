import { useState } from 'react';
import type { ColumnId, DragState } from '@/features/kanban/types';
import { COLUMNS } from '@/features/kanban/types';
import Column from '@/features/kanban/Column';

export default function KanbanBoard() {
  const [drag, setDrag] = useState<DragState>({ dragId: null, indicator: null });

  const beginDrag = (cardId: string) => setDrag({ dragId: cardId, indicator: null });
  const hover = (column: ColumnId, boundary: number) =>
    setDrag((current) =>
      current.dragId ? { ...current, indicator: { column, boundary } } : current,
    );
  const endDrag = () => setDrag({ dragId: null, indicator: null });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          drag={drag}
          beginDrag={beginDrag}
          hover={hover}
          endDrag={endDrag}
        />
      ))}
    </div>
  );
}
