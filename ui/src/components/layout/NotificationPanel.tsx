import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { getNotifications } from '@/services';
import { useClickOutside } from '@/hooks/useClickOutside';
import { usePortal } from '@/hooks/usePortal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/StateViews';
import type { AppNotification, Tone } from '@/types';
import { cn } from '@/utils/cn';

const dotColor: Record<Tone, string> = {
  positive: 'bg-secondary',
  warning: 'bg-warn',
  critical: 'bg-danger',
  neutral: 'bg-muted',
};

export function NotificationPanel() {
  const portal = usePortal();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  useEffect(() => {
    getNotifications(portal.id).then(setItems);
  }, [portal.id]);

  const unread = items?.filter((n) => !n.read).length ?? 0;
  const markAllRead = () => setItems((prev) => prev?.map((n) => ({ ...n, read: true })) ?? null);
  const markRead = (id: string) => setItems((prev) => prev?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? null);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative text-ink [&_svg]:size-5"
      >
        <Bell strokeWidth={1.75} />
        {unread > 0 && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger ring-2 ring-canvas" />}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="fixed inset-x-3 top-[76px] z-40 overflow-hidden rounded-2xl border border-line bg-card shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+8px)] sm:w-96"
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink">Notifications</p>
              <p className="text-xs text-muted">{unread} unread</p>
            </div>
            <Button variant="ghost" size="sm" onClick={markAllRead} disabled={unread === 0}>
              <CheckCheck /> Mark all read
            </Button>
          </header>
          <ul className="max-h-96 overflow-y-auto">
            {items === null &&
              [0, 1, 2].map((i) => (
                <li key={i} className="flex gap-3 px-4 py-3">
                  <Skeleton className="mt-1 size-2 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </li>
              ))}
            {items?.length === 0 && <EmptyState icon={BellOff} title="You're all caught up" />}
            {items?.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className={cn(
                    'flex w-full gap-3 border-b border-line/70 px-4 py-3 text-left last:border-0 hover:bg-canvas',
                    !n.read && 'bg-brand-50/40',
                  )}
                >
                  <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', dotColor[n.tone], n.read && 'opacity-30')} />
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-sm text-ink', !n.read && 'font-semibold')}>{n.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-muted/80">{n.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
