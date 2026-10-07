export const COLUMNS = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
] as const;

export type ColumnId = (typeof COLUMNS)[number]['id'];

export interface Card {
  id: string;
  title: string;
  description?: string;
}

export type Board = Record<ColumnId, Card[]>;

export interface CardDraft {
  title: string;
  description?: string;
}

export interface DragState {
  dragId: string | null;
  indicator: { column: ColumnId; boundary: number } | null;
}
