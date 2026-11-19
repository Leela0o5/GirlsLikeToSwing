import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileQuestion, Loader2, MessageSquarePlus, Play, Wrench } from 'lucide-react';
import { addTicketNote, getVehicleBundle, serviceAlertsStore, ticketsStore, toggleChecklistItem, updateTicketStatus } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useStore } from '@/hooks/useStore';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/field';
import { EmptyState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { KeyValueList } from '@/components/common/KeyValueList';
import { DemoBadge } from '@/components/common/DemoBadge';
import { AlertList } from '@/components/battery';
import { PriorityBadge, TicketStatusBadge, TicketStatusSelect } from '@/components/service/TicketBadges';
import { VehicleBatteryPanel } from '@/components/service/VehicleBatteryPanel';
import { SERVICE_ROUTES, passportPath } from '@/constants/routes';
import { formatDate, formatDateTime, vehicleName } from '@/utils/format';
import { cn } from '@/utils/cn';

export function ServiceTicketDetailPage() {
  const { id = '' } = useParams();
  const tickets = useStore(ticketsStore);
  const alerts = useStore(serviceAlertsStore);
  const ticket = tickets.find((t) => t.id === id);
  const { data: bundle, loading } = useAsync(() => getVehicleBundle(ticket?.vehicleId ?? ''), [ticket?.vehicleId]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const back = (
    <Link to={SERVICE_ROUTES.tickets} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary">
      <ArrowLeft className="size-4" aria-hidden="true" /> Back to tickets
    </Link>
  );

  if (!ticket) {
    return (
      <>
        {back}
        <Card>
          <EmptyState icon={FileQuestion} title="Ticket not found" description={`No service ticket with ID “${id}”.`} />
        </Card>
      </>
    );
  }
  if (loading || !bundle) return <>{back}<PageSkeleton /></>;

  const v = bundle.vehicle;
  const done = ticket.checklist.filter((c) => c.done).length;
  const progress = Math.round((done / ticket.checklist.length) * 100);
  const linkedAlerts = alerts.filter((a) => ticket.alertIds.includes(a.id));

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    await fn();
    setBusy(null);
  };
  const submitNote = (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    run('note', () => addTicketNote(ticket.id, note.trim())).then(() => setNote(''));
  };

  return (
    <>
      {back}
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">{ticket.id}</span>
            <PriorityBadge priority={ticket.priority} />
            <TicketStatusBadge status={ticket.status} />
            <DemoBadge />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{ticket.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {vehicleName(v)} · {ticket.customer} · due {formatDate(ticket.dueDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TicketStatusSelect ticketId={ticket.id} status={ticket.status} />
          {ticket.status === 'Open' && (
            <Button variant="soft" onClick={() => run('start', () => updateTicketStatus(ticket.id, 'In Progress'))} disabled={busy !== null}>
              {busy === 'start' ? <Loader2 className="animate-spin" /> : <Play />} Start work
            </Button>
          )}
          {ticket.status !== 'Completed' && (
            <Button onClick={() => run('complete', () => updateTicketStatus(ticket.id, 'Completed'))} disabled={busy !== null}>
              {busy === 'complete' ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Mark complete
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <div className="min-w-0 space-y-5">
          <Card aria-labelledby="desc-title">
            <CardHeader titleId="desc-title" title="Reported issue" />
            <p className="text-sm text-ink">{ticket.description}</p>
            {linkedAlerts.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Linked battery alerts</h3>
                <AlertList alerts={linkedAlerts} compact />
              </div>
            )}
          </Card>
          <VehicleBatteryPanel bundle={bundle} />
        </div>

        <aside className="min-w-0 space-y-5" aria-label="Ticket details">
          <Card aria-labelledby="details-title">
            <CardHeader titleId="details-title" title="Ticket details" />
            <KeyValueList
              items={[
                { label: 'Vehicle', value: <Link to={SERVICE_ROUTES.vehicle(v.id)} className="text-secondary hover:underline">{vehicleName(v)}</Link> },
                { label: 'VIN', value: <span className="font-mono text-xs">{v.vin}</span> },
                { label: 'Customer', value: ticket.customer },
                { label: 'Assigned to', value: ticket.assignedTo },
                { label: 'Created', value: formatDateTime(ticket.createdAt) },
                { label: 'Due', value: formatDate(ticket.dueDate) },
                { label: 'Battery passport', value: <Link to={passportPath('service', bundle.passportId)} className="text-secondary hover:underline">View</Link> },
              ]}
            />
          </Card>

          <Card aria-labelledby="check-title">
            <CardHeader titleId="check-title" title="Inspection checklist" subtitle={`${done} of ${ticket.checklist.length} complete`} />
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="h-full rounded-full bg-secondary transition-[width]" style={{ width: `${progress}%` }} />
            </div>
            <ul className="space-y-1">
              {ticket.checklist.map((c) => (
                <li key={c.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 text-sm hover:bg-canvas">
                    <input type="checkbox" checked={c.done} onChange={() => run(c.id, () => toggleChecklistItem(ticket.id, c.id))} disabled={busy === c.id} className="mt-0.5 size-4 accent-[#23865A]" />
                    <span className={cn(c.done ? 'text-muted line-through' : 'text-ink')}>{c.label}</span>
                    {busy === c.id && <Loader2 className="ml-auto size-3.5 animate-spin text-muted" aria-label="Saving" />}
                  </label>
                </li>
              ))}
            </ul>
          </Card>

          <Card aria-labelledby="recs-title">
            <CardHeader
              titleId="recs-title"
              title="Recommended maintenance"
              icon={
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-50 text-primary" aria-hidden="true">
                  <Wrench className="size-4" />
                </span>
              }
            />
            <ol className="space-y-2">
              {ticket.recommendedActions.map((a, i) => (
                <li key={a} className="flex gap-3 text-sm text-ink">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-primary">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[11px] text-muted">Rule-based demo suggestions, not ML output.</p>
          </Card>

          <Card aria-labelledby="activity-title">
            <CardHeader titleId="activity-title" title="Activity log" />
            <ol className="mb-4 max-h-72 space-y-3 overflow-y-auto pr-1" aria-live="polite">
              {[...ticket.activity].reverse().map((a) => (
                <li key={a.id} className="text-sm">
                  <p className="text-ink">{a.text}</p>
                  <p className="text-[11px] text-muted">
                    {a.author} · {formatDateTime(a.at)}
                  </p>
                </li>
              ))}
            </ol>
            <form onSubmit={submitNote} className="space-y-2">
              <label htmlFor="ticket-note" className="sr-only">
                Add a note
              </label>
              <Textarea id="ticket-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a technician note…" className="min-h-[70px]" />
              <Button type="submit" variant="soft" size="sm" disabled={!note.trim() || busy === 'note'}>
                {busy === 'note' ? <Loader2 className="animate-spin" /> : <MessageSquarePlus />} Add note
              </Button>
            </form>
          </Card>
        </aside>
      </div>
    </>
  );
}
