import FeatureStub from '@/components/FeatureStub';

export default function KanbanPage() {
  return (
    <FeatureStub
      question={3}
      title="Kanban Board"
      branch="feature/q3-kanban"
      brief="A multi-column board where cards move between columns by drag and drop."
      goals={[
        'Render columns (e.g. To do / In progress / Done) with cards',
        'Drag a card and drop it into another column, hand-rolled with native HTML5 drag events',
        'Reorder within a column, with a clear drop indicator',
        'Keep board state typed and in one store',
        'Tests for the move/reorder reducer logic',
      ]}
    />
  );
}
