import { describe, expect, it } from 'vitest';
import {
  addCard,
  counts,
  dropIndex,
  emptyBoard,
  findColumnOf,
  moveCard,
  removeCard,
  updateCard,
} from '@/features/kanban/logic';
import type { Board } from '@/features/kanban/types';

function board(): Board {
  return {
    todo: [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
      { id: 'c', title: 'C' },
    ],
    'in-progress': [{ id: 'x', title: 'X' }],
    done: [],
  };
}

describe('kanban logic', () => {
  it('finds the column that holds a card', () => {
    expect(findColumnOf(board(), 'b')).toBe('todo');
    expect(findColumnOf(board(), 'x')).toBe('in-progress');
    expect(findColumnOf(board(), 'missing')).toBeNull();
  });

  it('adds a card to the end of a column and updates counts', () => {
    const next = addCard(board(), 'done', { id: 'd', title: 'D' });
    expect(next.done.map((card) => card.id)).toEqual(['d']);
    expect(counts(next).done).toBe(1);
  });

  it('edits a card wherever it lives', () => {
    const next = updateCard(board(), 'x', { title: 'X2', description: 'note' });
    expect(next['in-progress'][0]).toEqual({ id: 'x', title: 'X2', description: 'note' });
  });

  it('removes a card and updates counts', () => {
    const next = removeCard(board(), 'b');
    expect(next.todo.map((card) => card.id)).toEqual(['a', 'c']);
    expect(counts(next).todo).toBe(2);
  });

  it('moves a card across columns, updating both columns and their counts', () => {
    const next = moveCard(board(), 'a', 'in-progress', 0);
    expect(next.todo.map((card) => card.id)).toEqual(['b', 'c']);
    expect(next['in-progress'].map((card) => card.id)).toEqual(['a', 'x']);
    expect(counts(next).todo).toBe(2);
    expect(counts(next)['in-progress']).toBe(2);
  });

  it('reorders within a column', () => {
    const next = moveCard(board(), 'a', 'todo', 2);
    expect(next.todo.map((card) => card.id)).toEqual(['b', 'c', 'a']);
  });

  it('clamps an out-of-range target index', () => {
    const next = moveCard(board(), 'x', 'done', 99);
    expect(next.done.map((card) => card.id)).toEqual(['x']);
  });

  it('leaves the board unchanged for an unknown card', () => {
    const original = board();
    expect(moveCard(original, 'missing', 'done', 0)).toBe(original);
  });

  it('does not mutate the input board', () => {
    const original = board();
    moveCard(original, 'a', 'done', 0);
    expect(original.todo.map((card) => card.id)).toEqual(['a', 'b', 'c']);
    expect(original.done).toEqual([]);
  });

  it('adjusts a same-column drop boundary for the removed card', () => {
    expect(dropIndex(board(), 'a', 'todo', 2)).toBe(1);
    expect(dropIndex(board(), 'c', 'todo', 0)).toBe(0);
    expect(dropIndex(board(), 'a', 'done', 0)).toBe(0);
  });

  it('builds an empty board with every column present', () => {
    expect(counts(emptyBoard())).toEqual({ todo: 0, 'in-progress': 0, done: 0 });
  });
});
