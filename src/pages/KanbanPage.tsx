import KanbanBoard from '@/features/kanban/KanbanBoard';

export default function KanbanPage() {
  return (
    <section>
      <h1 className="mb-2 text-2xl font-bold">Kanban Board</h1>
      <p className="mb-6 max-w-2xl text-slate-600">
        Drag cards between columns, or use each card&rsquo;s move buttons. The board is saved to
        your browser and survives a refresh.
      </p>
      <KanbanBoard />
    </section>
  );
}
