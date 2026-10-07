import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanBoard from '@/features/kanban/KanbanBoard';
import { useKanbanStore } from '@/features/kanban/store';
import type { Board } from '@/features/kanban/types';

function seed(board: Board) {
  useKanbanStore.setState({ board });
}

function column(label: string) {
  return screen.getByRole('region', { name: label });
}

beforeEach(() => {
  seed({
    todo: [{ id: 't1', title: 'Write brief' }],
    'in-progress': [],
    done: [],
  });
});

describe('KanbanBoard', () => {
  it('adds a card and updates the column count', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);
    const todo = column('To do');

    await user.click(within(todo).getByRole('button', { name: '+ Add card' }));
    await user.type(within(todo).getByPlaceholderText('Card title'), 'New task');
    await user.click(within(todo).getByRole('button', { name: 'Add card' }));

    expect(within(todo).getByText('New task')).toBeInTheDocument();
    expect(within(todo).getByLabelText('2 cards')).toBeInTheDocument();
  });

  it('requires a title before adding a card', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);
    const todo = column('To do');

    await user.click(within(todo).getByRole('button', { name: '+ Add card' }));
    await user.click(within(todo).getByRole('button', { name: 'Add card' }));

    expect(await within(todo).findByText('Title is required')).toBeInTheDocument();
    expect(within(todo).getByLabelText('1 cards')).toBeInTheDocument();
  });

  it('moves a card to the next column, updating both counts', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    await user.click(within(column('To do')).getByRole('button', { name: 'Move to next column' }));

    expect(within(column('In progress')).getByText('Write brief')).toBeInTheDocument();
    expect(within(column('To do')).queryByText('Write brief')).not.toBeInTheDocument();
    expect(within(column('To do')).getByLabelText('0 cards')).toBeInTheDocument();
    expect(within(column('In progress')).getByLabelText('1 cards')).toBeInTheDocument();
  });

  it('reorders cards within a column', async () => {
    seed({
      todo: [
        { id: 't1', title: 'First' },
        { id: 't2', title: 'Second' },
      ],
      'in-progress': [],
      done: [],
    });
    const user = userEvent.setup();
    render(<KanbanBoard />);
    const todo = column('To do');

    const firstCard = within(todo).getByText('First').closest('div');
    expect(firstCard).not.toBeNull();
    await user.click(within(firstCard as HTMLElement).getByRole('button', { name: 'Move down' }));

    const titles = within(todo)
      .getAllByText(/First|Second/)
      .map((node) => node.textContent);
    expect(titles).toEqual(['Second', 'First']);
  });

  it('edits a card title', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);
    const todo = column('To do');

    await user.click(within(todo).getByRole('button', { name: 'Edit' }));
    const input = within(todo).getByDisplayValue('Write brief');
    await user.clear(input);
    await user.type(input, 'Updated brief');
    await user.click(within(todo).getByRole('button', { name: 'Save' }));

    expect(within(todo).getByText('Updated brief')).toBeInTheDocument();
  });

  it('deletes a card', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);
    const todo = column('To do');

    await user.click(within(todo).getByRole('button', { name: 'Delete' }));

    expect(within(todo).queryByText('Write brief')).not.toBeInTheDocument();
    expect(within(todo).getByLabelText('0 cards')).toBeInTheDocument();
  });
});
