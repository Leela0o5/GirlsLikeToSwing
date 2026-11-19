import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import type { ServiceRecord } from '@/types';
import { getAllServiceHistory, getVehicleSync } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NativeSelect } from '@/components/ui/field';
import { EmptyState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { DataTable, type Column } from '@/components/common/DataTable';
import { SERVICE_ROUTES } from '@/constants/routes';
import { formatDate, vehicleName } from '@/utils/format';

const columns: Column<ServiceRecord>[] = [
  { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
  {
    key: 'vehicle',
    header: 'Vehicle',
    rowHeader: true,
    render: (r) => {
      const v = getVehicleSync(r.vehicleId);
      return (
        <Link to={SERVICE_ROUTES.vehicle(r.vehicleId)} className="font-medium text-ink hover:text-primary">
          {v ? vehicleName(v) : r.vehicleId}
        </Link>
      );
    },
  },
  { key: 'type', header: 'Service', render: (r) => <Badge tone={r.type === 'Battery inspection' ? 'positive' : 'neutral'} size="sm">{r.type}</Badge> },
  { key: 'summary', header: 'Summary', className: 'max-w-sm', render: (r) => <span className="text-muted">{r.summary}</span> },
  { key: 'soh', header: 'SoH at visit', align: 'right', render: (r) => (r.sohAtService !== undefined ? `${r.sohAtService}%` : '—') },
  { key: 'tech', header: 'Technician', render: (r) => r.technician },
];

export function ServiceHistoryPage() {
  const { data, loading } = useAsync(getAllServiceHistory, []);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const records = data ?? [];
  const types = [...new Set(records.map((r) => r.type))].sort();
  const q = query.toLowerCase();
  const rows = records
    .filter((r) => type === 'all' || r.type === type)
    .filter((r) => {
      if (!q) return true;
      const v = getVehicleSync(r.vehicleId);
      return [r.summary, r.center, r.technician, v ? `${vehicleName(v)} ${v.vin}` : ''].join(' ').toLowerCase().includes(q);
    });

  return (
    <>
      <PageHeader title="Service History" description="Completed service and battery work across all vehicles." actions={<DemoBadge />} />
      <Card className="p-0 sm:p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <span className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-canvas px-3 sm:max-w-xs">
            <Search className="size-4 text-muted" aria-hidden="true" />
            <input aria-label="Search service history" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Vehicle, VIN, technician…" className="min-w-0 flex-1 bg-transparent text-xs focus:outline-none" />
          </span>
          <NativeSelect aria-label="Filter by service type" value={type} onChange={(e) => setType(e.target.value)} className="h-9 w-48 rounded-full bg-canvas text-xs">
            <option value="all">All service types</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </NativeSelect>
          <p className="ml-auto text-xs text-muted" aria-live="polite">
            {loading ? 'Loading…' : `${rows.length} records`}
          </p>
        </div>
        <DataTable rows={rows} columns={columns} loading={loading} getRowId={(r) => r.id} caption="Service history" minWidth={960} empty={<EmptyState icon={SearchX} title="No matching records" />} />
      </Card>
    </>
  );
}
