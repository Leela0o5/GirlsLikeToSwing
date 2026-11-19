import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { InspectionStatus, TicketPriority, TicketStatus } from '@/types';
import { updateTicketStatus } from '@/services';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

export const TICKET_STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Awaiting Parts', 'Completed'];
export const PRIORITY_ORDER: Record<TicketPriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

const statusTone: Record<TicketStatus, 'neutral' | 'positive' | 'warning' | 'solid'> = {
  Open: 'neutral',
  'In Progress': 'positive',
  'Awaiting Parts': 'warning',
  Completed: 'solid',
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge tone={statusTone[status]} size="sm">
      {status}
    </Badge>
  );
}

const priorityChip: Record<TicketPriority, string> = {
  Critical: 'border-danger/30 bg-danger-soft text-danger',
  High: 'border-warn/30 bg-warn-soft text-warn',
  Medium: 'border-line bg-card text-ink',
  Low: 'border-line bg-card text-ink',
};

const priorityDot: Record<TicketPriority, string> = {
  Critical: 'bg-danger',
  High: 'bg-warn',
  Medium: 'bg-secondary',
  Low: 'bg-muted/60',
};

/** Priority indicator: coloured dot + text label (never colour alone). */
export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold', priorityChip[priority])}>
      <span className={cn('size-1.5 rounded-full', priorityDot[priority])} aria-hidden="true" />
      {priority}
    </span>
  );
}

const inspectionTone: Record<InspectionStatus, 'neutral' | 'positive' | 'warning' | 'critical' | 'solid'> = {
  Due: 'warning',
  Scheduled: 'neutral',
  'In Progress': 'positive',
  Passed: 'solid',
  Failed: 'critical',
};

export function InspectionStatusBadge({ status }: { status: InspectionStatus }) {
  return (
    <Badge tone={inspectionTone[status]} size="sm">
      {status}
    </Badge>
  );
}

export function TicketStatusSelect({ ticketId, status, className }: { ticketId: string; status: TicketStatus; className?: string }) {
  const [saving, setSaving] = useState(false);
  const change = async (next: TicketStatus) => {
    if (next === status) return;
    setSaving(true);
    await updateTicketStatus(ticketId, next);
    setSaving(false);
  };
  return (
    <span className={cn('relative inline-flex items-center', className)} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <select
        aria-label={`Status for ticket ${ticketId}`}
        value={status}
        disabled={saving}
        onChange={(e) => change(e.target.value as TicketStatus)}
        className="h-8 cursor-pointer rounded-full border border-line bg-canvas pl-3 pr-7 text-xs font-medium text-ink hover:bg-brand-50 disabled:opacity-60"
      >
        {TICKET_STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      {saving && <Loader2 className="absolute right-2 size-3.5 animate-spin text-muted" aria-label="Saving" />}
    </span>
  );
}
