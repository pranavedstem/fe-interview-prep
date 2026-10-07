import type { Board, Card, CardDraft, ColumnId } from '@/features/kanban/types';
import { COLUMNS } from '@/features/kanban/types';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function insertAt<T>(list: T[], index: number, item: T): T[] {
  return [...list.slice(0, index), item, ...list.slice(index)];
}

export function emptyBoard(): Board {
  return { todo: [], 'in-progress': [], done: [] };
}

export function findColumnOf(board: Board, cardId: string): ColumnId | null {
  for (const { id } of COLUMNS) {
    if (board[id].some((card) => card.id === cardId)) return id;
  }
  return null;
}

export function addCard(board: Board, columnId: ColumnId, card: Card): Board {
  return { ...board, [columnId]: [...board[columnId], card] };
}

export function updateCard(board: Board, cardId: string, draft: CardDraft): Board {
  const columnId = findColumnOf(board, cardId);
  if (columnId === null) return board;
  return {
    ...board,
    [columnId]: board[columnId].map((card) =>
      card.id === cardId ? { ...card, title: draft.title, description: draft.description } : card,
    ),
  };
}

export function removeCard(board: Board, cardId: string): Board {
  const columnId = findColumnOf(board, cardId);
  if (columnId === null) return board;
  return { ...board, [columnId]: board[columnId].filter((card) => card.id !== cardId) };
}

export function moveCard(board: Board, cardId: string, toColumn: ColumnId, toIndex: number): Board {
  const from = findColumnOf(board, cardId);
  if (from === null) return board;
  const card = board[from].find((item) => item.id === cardId);
  if (card === undefined) return board;

  const source = board[from].filter((item) => item.id !== cardId);
  if (from === toColumn) {
    return { ...board, [from]: insertAt(source, clamp(toIndex, 0, source.length), card) };
  }
  const dest = insertAt(board[toColumn], clamp(toIndex, 0, board[toColumn].length), card);
  return { ...board, [from]: source, [toColumn]: dest };
}

export function dropIndex(
  board: Board,
  cardId: string,
  toColumn: ColumnId,
  boundary: number,
): number {
  if (findColumnOf(board, cardId) === toColumn) {
    const sourceIndex = board[toColumn].findIndex((item) => item.id === cardId);
    if (sourceIndex !== -1 && sourceIndex < boundary) return boundary - 1;
  }
  return boundary;
}

export function counts(board: Board): Record<ColumnId, number> {
  return {
    todo: board.todo.length,
    'in-progress': board['in-progress'].length,
    done: board.done.length,
  };
}
