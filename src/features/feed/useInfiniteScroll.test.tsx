import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useInfiniteScroll } from '@/features/feed/useInfiniteScroll';

const instances: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  readonly callback: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    instances.push(this);
  }

  emit(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function Sentinel({ onIntersect, enabled }: { onIntersect: () => void; enabled: boolean }) {
  const ref = useInfiniteScroll(onIntersect, enabled);
  return <div ref={ref} />;
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    instances.length = 0;
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('observes the sentinel and fires onIntersect when it scrolls into view', () => {
    const onIntersect = vi.fn();
    render(<Sentinel onIntersect={onIntersect} enabled />);

    expect(instances).toHaveLength(1);
    expect(instances[0].observe).toHaveBeenCalledTimes(1);

    instances[0].emit(true);
    expect(onIntersect).toHaveBeenCalledTimes(1);
  });

  it('does not observe at all while disabled', () => {
    const onIntersect = vi.fn();
    render(<Sentinel onIntersect={onIntersect} enabled={false} />);

    expect(instances).toHaveLength(0);
    expect(onIntersect).not.toHaveBeenCalled();
  });

  it('ignores an entry that is not intersecting', () => {
    const onIntersect = vi.fn();
    render(<Sentinel onIntersect={onIntersect} enabled />);

    instances[0].emit(false);
    expect(onIntersect).not.toHaveBeenCalled();
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<Sentinel onIntersect={vi.fn()} enabled />);
    const observer = instances[0];

    unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
