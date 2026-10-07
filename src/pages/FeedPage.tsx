import FeatureStub from '@/components/FeatureStub';

export default function FeedPage() {
  return (
    <FeatureStub
      question={2}
      title="Infinite Feed"
      branch="feature/q2-feed"
      brief="A paginated feed that loads more as you scroll — without firing duplicate page loads."
      goals={[
        'Render a scrollable list that appends the next page near the bottom',
        'Guard against duplicate loads of the same page (in-flight + already-loaded)',
        'Show loading and end-of-feed states',
        'Stop requesting once the last page is reached',
        'Tests that a page is never requested twice',
      ]}
    />
  );
}
