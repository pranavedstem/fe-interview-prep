import { useEffect } from 'react';
import { fetchSnapshot } from '@/features/dashboard/api';
import { useDashboardStore } from '@/features/dashboard/store';

export function useDashboardFeed(intervalMs = 5000): void {
  const applySnapshot = useDashboardStore((state) => state.applySnapshot);

  useEffect(() => {
    let generation = 0;
    let inFlight = false;
    let stopped = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const poll = async () => {
      if (document.hidden || inFlight) return;
      inFlight = true;
      generation += 1;
      const snapshot = await fetchSnapshot(generation).catch(() => null);
      inFlight = false;
      if (snapshot && !stopped) applySnapshot(snapshot);
    };

    const start = () => {
      if (timer !== undefined) return;
      void poll();
      timer = setInterval(() => void poll(), intervalMs);
    };

    const stop = () => {
      if (timer === undefined) return;
      clearInterval(timer);
      timer = undefined;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopped = true;
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [applySnapshot, intervalMs]);
}
