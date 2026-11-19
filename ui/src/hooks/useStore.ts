import { useEffect, useState, useSyncExternalStore } from 'react';
import type { MockStore } from '@/services/mockStore';

export function useStore<T>(store: MockStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Shows a short loading phase on mount so store-backed pages get real skeletons. */
export function useInitialLoading(ms = 350): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
