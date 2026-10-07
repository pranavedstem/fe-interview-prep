import FeatureStub from '@/components/FeatureStub';

export default function DashboardPage() {
  return (
    <FeatureStub
      question={4}
      title="Dashboard"
      branch="feature/q4-dashboard"
      brief="A metrics dashboard with filters and hand-rolled charts."
      goals={[
        'Summary cards for key metrics derived from a dataset',
        'A filter (date range / category) that recomputes the view',
        'At least one chart drawn from scratch (SVG), no charting library',
        'Memoise the derived/aggregated data',
        'Tests for the aggregation and filter logic',
      ]}
    />
  );
}
