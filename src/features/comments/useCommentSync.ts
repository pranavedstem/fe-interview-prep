import { useCallback, useEffect, useRef, useState } from 'react';
import { postComment } from '@/features/comments/api';
import { useCommentsStore } from '@/features/comments/store';
import { nextPending } from '@/features/comments/logic';

export function useCommentSync(): { online: boolean } {
  const [online, setOnline] = useState(() => navigator.onLine);
  const draining = useRef(false);

  const drain = useCallback(async () => {
    if (draining.current || !navigator.onLine) return;
    draining.current = true;
    try {
      while (navigator.onLine) {
        const pending = nextPending(useCommentsStore.getState().comments);
        if (!pending) break;
        try {
          const saved = await postComment({
            clientId: pending.clientId,
            author: pending.author,
            body: pending.body,
          });
          useCommentsStore.getState().confirm(pending.clientId, saved.serverId);
        } catch {
          useCommentsStore.getState().fail(pending.clientId);
        }
      }
    } finally {
      draining.current = false;
    }
  }, []);

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      void drain();
    };
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    const unsubscribe = useCommentsStore.subscribe(() => void drain());
    void drain();

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      unsubscribe();
    };
  }, [drain]);

  return { online };
}
