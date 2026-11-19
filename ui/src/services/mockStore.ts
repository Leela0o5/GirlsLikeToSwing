/**
 * Tiny in-memory store for MUTABLE mock data (ticket status, alerts acknowledged,
 * saved vehicles…). Components subscribe with `useStore`. When the backend
 * exists, mutations become API calls followed by a refetch / cache update.
 */
export interface MockStore<T> {
  get: () => T;
  set: (updater: (prev: T) => T) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(initial: T, persistKey?: string): MockStore<T> {
  let state = initial;
  if (persistKey) {
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) state = JSON.parse(saved) as T;
    } catch {
      /* storage unavailable — fall back to initial */
    }
  }
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (updater) => {
      state = updater(state);
      if (persistKey) {
        try {
          localStorage.setItem(persistKey, JSON.stringify(state));
        } catch {
          /* ignore */
        }
      }
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function mockMutation<T>(store: MockStore<T>, updater: (prev: T) => T, latency = 250): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      store.set(updater);
      resolve();
    }, latency),
  );
}

export const nowIso = () => new Date().toISOString().slice(0, 19);
