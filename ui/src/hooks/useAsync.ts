import { useEffect, useState, type DependencyList } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/** Runs an async loader and tracks loading / error / data. Ignores stale responses. */
export function useAsync<T>(loader: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loader()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active)
          setState({ data: null, loading: false, error: error instanceof Error ? error : new Error(String(error)) });
      });
    return () => {
      active = false;
    };
    // loader is intentionally excluded; callers control re-runs via deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
