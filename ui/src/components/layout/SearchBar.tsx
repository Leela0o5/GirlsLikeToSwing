import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, Search, SearchX, X } from 'lucide-react';
import { searchPortal } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useClickOutside } from '@/hooks/useClickOutside';
import { usePortal } from '@/hooks/usePortal';
import { Badge } from '@/components/ui/badge';
import type { SearchResult } from '@/types';
import { cn } from '@/utils/cn';

export function SearchBar({ className }: { className?: string }) {
  const portal = usePortal();
  const navigate = useNavigate();
  const listId = useId();
  const inputId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const debounced = useDebounce(query.trim(), 180);

  const { data, loading } = useAsync(
    () => (debounced ? searchPortal(portal.id, debounced) : Promise.resolve<SearchResult[]>([])),
    [debounced, portal.id],
  );
  const results = data ?? [];
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(wrapperRef, close, open);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      // offsetParent is null when this instance is hidden (desktop vs mobile copy)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && inputRef.current?.offsetParent) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setActive(0), [debounced]);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = results[active];
      if (picked) go(picked.to);
      else if (portal.searchAllRoute && query.trim()) go(portal.searchAllRoute(query.trim()));
    }
  };

  const showPanel = open && query.trim().length > 0;
  const pending = loading || debounced !== query.trim();

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <label htmlFor={inputId} className="sr-only">
        {portal.searchPlaceholder}
      </label>
      <div className="flex h-12 items-center gap-2 rounded-2xl border border-line bg-card px-3 shadow-card focus-within:border-secondary/50">
        <kbd className="hidden rounded-md border border-line bg-canvas px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted md:inline">
          Ctrl K
        </kbd>
        <Search className="size-[18px] shrink-0 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={portal.searchPlaceholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted/80 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="rounded-full p-1 text-muted hover:bg-canvas hover:text-ink"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-line bg-card shadow-pop">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Results
            {pending && <Loader2 className="size-3.5 animate-spin" aria-label="Searching" />}
          </div>
          <ul id={listId} role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto py-1">
            {!pending && results.length === 0 && (
              <li className="flex flex-col items-center gap-1 px-4 py-6 text-center text-sm text-muted">
                <SearchX className="size-5" aria-hidden="true" />
                No matches for “{query.trim()}”
              </li>
            )}
            {results.map((r, i) => (
              <li
                key={r.id}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(r.to)}
                className={cn('flex cursor-pointer items-center gap-3 px-4 py-2.5', i === active && 'bg-brand-50/70')}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
                  <span className="block truncate text-xs text-muted">{r.subtitle}</span>
                </span>
                {r.badge ? (
                  <Badge tone={r.badge.tone} size="sm" className="capitalize">
                    {r.badge.label}
                  </Badge>
                ) : (
                  <ChevronRight className="size-4 text-muted" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
          {portal.searchAllRoute && (
            <button
              type="button"
              onClick={() => go(portal.searchAllRoute!(query.trim()))}
              className="w-full border-t border-line px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-canvas"
            >
              View all results →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
