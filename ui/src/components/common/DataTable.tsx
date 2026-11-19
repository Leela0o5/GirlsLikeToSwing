import type { KeyboardEvent, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  /** Marks the cell as the row header (for screen readers) */
  rowHeader?: boolean;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  caption: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  empty?: ReactNode;
  minWidth?: number;
  rowClassName?: (row: T) => string | undefined;
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  caption,
  onRowClick,
  loading = false,
  empty,
  minWidth = 720,
  rowClassName,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3 p-4" aria-busy="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (rows.length === 0 && empty) return <>{empty}</>;

  const onKey = (e: KeyboardEvent, row: T) => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-canvas text-xs text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('px-4 py-3 font-medium', alignClass[c.align ?? 'left'], c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowId(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={onRowClick ? (e) => onKey(e, row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              className={cn(
                'border-t border-line',
                onRowClick && 'cursor-pointer hover:bg-canvas/70 focus-visible:bg-brand-50/50',
                rowClassName?.(row),
              )}
            >
              {columns.map((c) => {
                const Cell = c.rowHeader ? 'th' : 'td';
                return (
                  <Cell
                    key={c.key}
                    scope={c.rowHeader ? 'row' : undefined}
                    className={cn('px-4 py-3 align-middle font-normal', alignClass[c.align ?? 'left'], c.className)}
                  >
                    {c.render(row)}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
