import type { ServiceTicket } from '@/types';
import type { Column } from '@/components/common/DataTable';
import { getVehicleSync } from '@/services';
import { formatDate, vehicleName } from '@/utils/format';
import { PriorityBadge, TicketStatusBadge, TicketStatusSelect } from './TicketBadges';

const OVERDUE_BEFORE = '2026-11-21';

export function ticketColumns({ editableStatus = false, compact = false } = {}): Column<ServiceTicket>[] {
  const cols: Column<ServiceTicket>[] = [
    { key: 'id', header: 'Ticket', render: (t) => <span className="whitespace-nowrap font-mono text-xs font-semibold text-primary">{t.id}</span> },
    {
      key: 'issue',
      header: 'Vehicle & issue',
      rowHeader: true,
      render: (t) => {
        const v = getVehicleSync(t.vehicleId);
        return (
          <>
            <span className="font-medium text-ink">{t.title}</span>
            <span className="block text-xs text-muted">{v ? vehicleName(v) : t.vehicleId}</span>
          </>
        );
      },
    },
    { key: 'priority', header: 'Priority', render: (t) => <PriorityBadge priority={t.priority} /> },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (editableStatus ? <TicketStatusSelect ticketId={t.id} status={t.status} /> : <TicketStatusBadge status={t.status} />),
    },
    {
      key: 'due',
      header: 'Due',
      render: (t) => (
        <span className={`whitespace-nowrap ${t.status !== 'Completed' && t.dueDate < OVERDUE_BEFORE ? 'font-semibold text-danger' : 'text-ink'}`}>
          {formatDate(t.dueDate)}
        </span>
      ),
    },
  ];
  if (!compact) {
    cols.splice(2, 0, { key: 'customer', header: 'Customer', render: (t) => t.customer });
    cols.push({ key: 'tech', header: 'Assigned', render: (t) => t.assignedTo });
  }
  return cols;
}
