import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SearchX, X } from 'lucide-react';
import type { TicketPriority, TicketStatus } from '@/types';
import { getVehicleSync, ticketsStore } from '@/services';
import { useInitialLoading, useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { NativeSelect } from '@/components/ui/field';
import { EmptyState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { DataTable } from '@/components/common/DataTable';
import { PRIORITY_ORDER, TICKET_STATUSES } from '@/components/service/TicketBadges';
import { ticketColumns } from '@/components/service/ticketColumns';
import { SERVICE_ROUTES } from '@/constants/routes';
import { vehicleName } from '@/utils/format';

type StatusFilter = 'all' | TicketStatus;

export function ServiceTicketsPage() {
  const navigate = useNavigate();
  const tickets = useStore(ticketsStore);
  const loading = useInitialLoading();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [status, setStatus] = useState<StatusFilter>('all');
  const [priority, setPriority] = useState<'all' | TicketPriority>('all');

  const q = query.toLowerCase();
  const rows = tickets
    .filter((t) => status === 'all' || t.status === status)
    .filter((t) => priority === 'all' || t.priority === priority)
    .filter((t) => {
      if (!q) return true;
      const v = getVehicleSync(t.vehicleId);
      return [t.id, t.title, t.customer, t.assignedTo, v ? `${vehicleName(v)} ${v.vin}` : ''].join(' ').toLowerCase().includes(q);
    })
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.dueDate.localeCompare(b.dueDate));

  const reset = () => {
    setStatus('all');
    setPriority('all');
    setParams({}, { replace: true });
  };

  return (
    <>
      <PageHeader title="Service Tickets" description="Manage battery service requests. Change status inline or open a ticket for details." actions={<DemoBadge />} />
      <Card className="p-0 sm:p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <Tabs
            label="Filter by status"
            value={status}
            onChange={setStatus}
            tabs={[{ id: 'all' as const, label: 'All', count: tickets.length }, ...TICKET_STATUSES.map((s) => ({ id: s, label: s, count: tickets.filter((t) => t.status === s).length }))]}
          />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <NativeSelect aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value as 'all' | TicketPriority)} className="h-9 w-40 rounded-full bg-canvas text-xs">
              <option value="all">All priorities</option>
              {(['Critical', 'High', 'Medium', 'Low'] as const).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </NativeSelect>
            <span className="flex h-9 w-60 items-center gap-2 rounded-full border border-line bg-canvas px-3">
              <Search className="size-4 text-muted" aria-hidden="true" />
              <input
                aria-label="Search tickets"
                value={query}
                onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
                placeholder="ID, customer, VIN…"
                className="min-w-0 flex-1 bg-transparent text-xs focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setParams({}, { replace: true })} aria-label="Clear search" className="text-muted hover:text-ink">
                  <X className="size-3.5" />
                </button>
              )}
            </span>
          </div>
        </div>
        <DataTable
          rows={rows}
          columns={ticketColumns({ editableStatus: true })}
          loading={loading}
          getRowId={(t) => t.id}
          caption="Service tickets"
          onRowClick={(t) => navigate(SERVICE_ROUTES.ticket(t.id))}
          minWidth={960}
          empty={<EmptyState icon={SearchX} title="No tickets match" action={<Button variant="soft" size="sm" onClick={reset}>Reset filters</Button>} />}
        />
      </Card>
    </>
  );
}
