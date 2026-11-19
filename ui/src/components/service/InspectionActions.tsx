import { useState } from 'react';
import { CalendarClock, Check, Loader2, Play, RotateCcw, X } from 'lucide-react';
import type { Inspection, InspectionStatus } from '@/types';
import { updateInspectionStatus } from '@/services';
import { Button } from '@/components/ui/button';

const NEXT: Record<InspectionStatus, { to: InspectionStatus; label: string; icon: typeof Check; variant: 'primary' | 'soft' | 'outline' }[]> = {
  Due: [{ to: 'Scheduled', label: 'Schedule', icon: CalendarClock, variant: 'soft' }],
  Scheduled: [{ to: 'In Progress', label: 'Start', icon: Play, variant: 'soft' }],
  'In Progress': [
    { to: 'Passed', label: 'Pass', icon: Check, variant: 'primary' },
    { to: 'Failed', label: 'Fail', icon: X, variant: 'outline' },
  ],
  Passed: [{ to: 'Due', label: 'Reopen', icon: RotateCcw, variant: 'outline' }],
  Failed: [{ to: 'Scheduled', label: 'Re-schedule', icon: CalendarClock, variant: 'outline' }],
};

export function InspectionActions({ inspection }: { inspection: Inspection }) {
  const [saving, setSaving] = useState<InspectionStatus | null>(null);
  const run = async (to: InspectionStatus) => {
    setSaving(to);
    await updateInspectionStatus(inspection.id, to);
    setSaving(null);
  };
  return (
    <span className="inline-flex gap-1.5" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      {NEXT[inspection.status].map((a) => (
        <Button key={a.to} variant={a.variant} size="sm" onClick={() => run(a.to)} disabled={saving !== null} aria-label={`${a.label} inspection ${inspection.id}`}>
          {saving === a.to ? <Loader2 className="animate-spin" /> : <a.icon />} {a.label}
        </Button>
      ))}
    </span>
  );
}
