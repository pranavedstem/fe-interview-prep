import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, CardDraft, ColumnId } from '@/features/kanban/types';
import {
  addCard as addCardTo,
  moveCard as moveCardIn,
  removeCard as removeCardFrom,
  updateCard as updateCardIn,
} from '@/features/kanban/logic';

function createId(): string {
  return crypto.randomUUID();
}

const seedBoard: Board = {
  todo: [
    { id: createId(), title: 'Draft the project brief', description: 'Outline goals and scope.' },
    { id: createId(), title: 'Set up the repository' },
  ],
  'in-progress': [{ id: createId(), title: 'Design the board layout' }],
  done: [{ id: createId(), title: 'Pick a tech stack' }],
};

interface KanbanState {
  board: Board;
  addCard: (columnId: ColumnId, draft: CardDraft) => void;
  editCard: (cardId: string, draft: CardDraft) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, toColumn: ColumnId, toIndex: number) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      board: seedBoard,
      addCard: (columnId, draft) =>
        set((state) => ({ board: addCardTo(state.board, columnId, { id: createId(), ...draft }) })),
      editCard: (cardId, draft) =>
        set((state) => ({ board: updateCardIn(state.board, cardId, draft) })),
      deleteCard: (cardId) => set((state) => ({ board: removeCardFrom(state.board, cardId) })),
      moveCard: (cardId, toColumn, toIndex) =>
        set((state) => ({ board: moveCardIn(state.board, cardId, toColumn, toIndex) })),
    }),
    { name: 'q3-kanban' },
  ),
);
