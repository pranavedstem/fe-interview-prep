import FeatureStub from '@/components/FeatureStub';

export default function CartPage() {
  return (
    <FeatureStub
      question={1}
      title="Shopping Cart"
      branch="feature/q1-cart"
      brief="A shopping cart with quantity controls and a live total."
      goals={[
        'List cart line items with name, unit price and quantity',
        'Increment / decrement quantity, and remove a line',
        'Prevent quantity dropping below one (or remove at zero)',
        'Show a running subtotal and total that update as quantities change',
        'Tests for the quantity and total logic',
      ]}
    />
  );
}
