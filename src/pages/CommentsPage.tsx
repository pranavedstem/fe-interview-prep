import FeatureStub from '@/components/FeatureStub';

export default function CommentsPage() {
  return (
    <FeatureStub
      question={5}
      title="Threaded Comments"
      branch="feature/q5-comments"
      brief="A nested comment thread you can reply to, edit and delete."
      goals={[
        'Render comments as an arbitrarily deep tree',
        'Reply to any comment, adding a child at the right depth',
        'Edit and delete a comment (deleting prunes its subtree or tombstones it)',
        'Validated reply/edit form with React Hook Form + Zod',
        'Tests for the tree insert / update / delete helpers',
      ]}
    />
  );
}
