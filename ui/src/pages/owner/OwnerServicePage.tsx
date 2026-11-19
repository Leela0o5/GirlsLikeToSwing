import { useAsync } from '@/hooks/useAsync';
import { useState, type FormEvent } from 'react';
import { CalendarPlus, CheckCircle2, Loader2 } from 'lucide-react';
import { getOwnerOverview, ownerAppointmentsStore, requestServiceAppointment } from '@/services';
import { useStore } from '@/hooks/useStore';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, NativeSelect, Textarea } from '@/components/ui/field';
import { ErrorState, EmptyState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { ServiceHistoryTimeline } from '@/components/battery';
import { formatDate } from '@/utils/format';

const SERVICE_TYPES = ['Battery inspection', 'Routine maintenance', 'Charging issue', 'Software update', 'Other'];

function RequestServiceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = useState(SERVICE_TYPES[0]);
  const [date, setDate] = useState('2026-12-02');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await requestServiceAppointment({ type, date, notes: notes || '—' });
    setSubmitting(false);
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Request a service" description="Demo request — it is saved for this session only and not sent anywhere.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Service type">
          {(id) => (
            <NativeSelect id={id} value={type} onChange={(e) => setType(e.target.value)}>
              {SERVICE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </NativeSelect>
          )}
        </Field>
        <Field label="Preferred date">
          {(id) => <Input id={id} type="date" required min="2026-11-20" value={date} onChange={(e) => setDate(e.target.value)} />}
        </Field>
        <Field label="Notes" hint="Optional — describe any symptoms.">
          {(id) => <Textarea id={id} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Range seems lower than usual" />}
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin" /> : <CalendarPlus />} Submit request
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export function OwnerServicePage() {
  const { data, loading, error } = useAsync(getOwnerOverview, []);
  const appointments = useStore(ownerAppointmentsStore);
  const [open, setOpen] = useState(false);

  if (error) return <ErrorState message="Unable to load service history." />;
  if (loading || !data) return <PageSkeleton />;
  const history = data.serviceHistory;

  return (
    <>
      <PageHeader
        title="Service History"
        description="Past service visits and upcoming appointments."
        actions={
          <Button onClick={() => setOpen(true)}>
            <CalendarPlus /> Request service
          </Button>
        }
      />
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <Card aria-labelledby="history-title">
          <CardHeader titleId="history-title" title="Service records" subtitle={`${history.length} visits on file (demo)`} />
          <ServiceHistoryTimeline records={history} />
        </Card>
        <div className="space-y-5">
          <Card aria-labelledby="upcoming-title">
            <CardHeader titleId="upcoming-title" title="Upcoming appointments" />
            {appointments.length === 0 ? (
              <EmptyState title="No upcoming appointments" action={<Button size="sm" variant="soft" onClick={() => setOpen(true)}>Request service</Button>} />
            ) : (
              <ul className="space-y-2.5">
                {appointments.map((a) => (
                  <li key={a.id} className="rounded-2xl border border-line px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{a.type}</p>
                      <Badge tone={a.status === 'Confirmed' ? 'positive' : 'warning'} size="sm">
                        {a.status === 'Confirmed' && <CheckCircle2 aria-hidden="true" />}
                        {a.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted">
                      {formatDate(a.date)} · {a.notes}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card aria-labelledby="summary-title">
            <CardHeader titleId="summary-title" title="Maintenance summary" />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs text-muted">Last visit</dt>
                <dd className="font-semibold text-ink">{history[0] ? formatDate(history[0].date) : '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Visits on file</dt>
                <dd className="font-semibold text-ink">{history.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Last battery check</dt>
                <dd className="font-semibold text-ink">
                  {formatDate(history.find((h) => h.type === 'Battery inspection')?.date ?? '2025-08-14')}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Next battery check</dt>
                <dd className="font-semibold text-warn">Due Dec 2026</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
      <RequestServiceDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
