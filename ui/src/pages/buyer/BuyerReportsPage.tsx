import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Listing, VerificationStatus } from '@/types';
import { getListings } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { DataTable, type Column } from '@/components/common/DataTable';
import { SohMeter, VerificationBadge } from '@/components/battery';
import { BUYER_ROUTES, passportPath } from '@/constants/routes';
import { formatCurrency, formatDate, riskTone } from '@/utils/format';

type Filter = 'all' | VerificationStatus;

const columns: Column<Listing>[] = [
  {
    key: 'vehicle',
    header: 'Vehicle',
    rowHeader: true,
    render: (l) => (
      <>
        <span className="font-medium text-ink">
          {l.vehicle.year} {l.vehicle.make} {l.vehicle.model}
        </span>
        <span className="block text-xs text-muted">{l.vehicle.trim}</span>
      </>
    ),
  },
  { key: 'soh', header: 'SoH', render: (l) => <SohMeter value={l.vehicle.sohPercent} className="w-36" /> },
  { key: 'range', header: 'Est. range', align: 'right', render: (l) => `${l.vehicle.estRangeMiles} mi` },
  { key: 'risk', header: 'Risk', render: (l) => <Badge tone={riskTone(l.vehicle.risk)} size="sm">{l.vehicle.risk}</Badge> },
  { key: 'assessed', header: 'Assessed', render: (l) => formatDate(l.assessedOn) },
  { key: 'verification', header: 'Status', render: (l) => <VerificationBadge status={l.verification} size="sm" /> },
  { key: 'value', header: 'Est. trade-in', align: 'right', render: (l) => formatCurrency(l.estTradeInValue) },
  {
    key: 'links',
    header: <span className="sr-only">Links</span>,
    align: 'right',
    render: (l) => (
      <Link to={passportPath('buyer', l.passportId)} onClick={(e) => e.stopPropagation()} className="text-xs font-semibold text-secondary hover:text-primary">
        Passport
      </Link>
    ),
  },
];

export function BuyerReportsPage() {
  const navigate = useNavigate();
  const { data, loading } = useAsync(getListings, []);
  const [filter, setFilter] = useState<Filter>('all');
  const all = data ?? [];
  const rows = all.filter((l) => filter === 'all' || l.verification === filter).sort((a, b) => b.assessedOn.localeCompare(a.assessedOn));
  const count = (s: VerificationStatus) => all.filter((l) => l.verification === s).length;

  return (
    <>
      <PageHeader title="Battery Reports" description="Battery assessments for every listed vehicle. Select a row to open the full report." actions={<DemoBadge />} />
      <Card className="p-0 sm:p-0">
        <div className="p-4">
          <Tabs
            label="Filter by verification"
            value={filter}
            onChange={setFilter}
            tabs={[
              { id: 'all', label: 'All', count: all.length },
              { id: 'Verified', label: 'Verified', count: count('Verified') },
              { id: 'Pending', label: 'Pending', count: count('Pending') },
              { id: 'Expired', label: 'Expired', count: count('Expired') },
            ]}
          />
        </div>
        <DataTable
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(l) => l.id}
          caption="Battery reports"
          onRowClick={(l) => navigate(BUYER_ROUTES.listing(l.id))}
          empty={<EmptyState title="No reports with this status" />}
          minWidth={900}
        />
      </Card>
    </>
  );
}
