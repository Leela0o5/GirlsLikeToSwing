import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Inspection, InspectionStatus } from '@/types';
import { getVehicleSync, inspectionsStore } from '@/services';
import { useInitialLoading, useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { DataTable, type Column } from '@/components/common/DataTable';
import { SohMeter } from '@/components/battery';
import { InspectionActions } from '@/components/service/InspectionActions';
import { InspectionStatusBadge, PRIORITY_ORDER, PriorityBadge } from '@/components/service/TicketBadges';
import { SERVICE_ROUTES } from '@/constants/routes';
import { formatDate, vehicleName } from '@/utils/format';

type Filter = 'pending' | 'all' | InspectionStatus;
const STATUSES: InspectionStatus[] = ['Due', 'Scheduled', 'In Progress', 'Passed', 'Failed'];

const isPending = (i: Inspection) => i.status !== 'Passed' && i.status !== 'Failed';

function matchesFilter(i: Inspection, filter: Filter) {
  if (filter === 'all') return true;
  if (filter === 'pending') return isPending(i);
  return i.status === filter;
}

const columns: Column<Inspection>[] = [
  { key: 'id', header: 'ID', render: (i) => <span className="whitespace-nowrap font-mono text-xs font-semibold text-primary">{i.id}</span> },
  {
    key: 'vehicle',
    header: 'Vehicle',
    rowHeader: true,
    render: (i) => {
      const v = getVehicleSync(i.vehicleId);
      return (
        <>
          <Link to={SERVICE_ROUTES.vehicle(i.vehicleId)} className="font-medium text-ink hover:text-primary">
            {v ? vehicleName(v) : i.vehicleId}
          </Link>
          <span className="block font-mono text-[11px] text-muted">{v?.vin}</span>
        </>
      );
    },
  },
  { key: 'soh', header: 'SoH', render: (i) => <SohMeter value={getVehicleSync(i.vehicleId)?.sohPercent ?? 0} className="w-32" /> },
  { key: 'reason', header: 'Reason', render: (i) => i.reason },
  { key: 'priority', header: 'Priority', render: (i) => <PriorityBadge priority={i.priority} /> },
  { key: 'due', header: 'Due', className: 'whitespace-nowrap', render: (i) => formatDate(i.dueDate) },
  { key: 'bay', header: 'Bay', render: (i) => i.bay ?? <span className="text-muted">—</span> },
  { key: 'status', header: 'Status', render: (i) => <InspectionStatusBadge status={i.status} /> },
  { key: 'actions', header: <span className="sr-only">Actions</span>, align: 'right', render: (i) => <InspectionActions inspection={i} /> },
];

export function ServiceInspectionsPage() {
  const inspections = useStore(inspectionsStore);
  const loading = useInitialLoading();
  const [filter, setFilter] = useState<Filter>('pending');

  const rows = inspections
    .filter((i) => matchesFilter(i, filter))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.dueDate.localeCompare(b.dueDate));

  return (
    <>
      <PageHeader title="Battery Inspections" description="Vehicles requiring battery inspection. Update status as work progresses." actions={<DemoBadge />} />
      <Card className="p-0 sm:p-0">
        <div className="border-b border-line p-4">
          <Tabs
            label="Filter inspections"
            value={filter}
            onChange={setFilter}
            tabs={[
              { id: 'pending' as const, label: 'Pending', count: inspections.filter(isPending).length },
              ...STATUSES.map((s) => ({ id: s, label: s, count: inspections.filter((i) => i.status === s).length })),
              { id: 'all' as const, label: 'All', count: inspections.length },
            ]}
          />
        </div>
        <DataTable rows={rows} columns={columns} loading={loading} getRowId={(i) => i.id} caption="Battery inspections" minWidth={1080} empty={<EmptyState title="No inspections in this state" />} />
      </Card>
    </>
  );
}
