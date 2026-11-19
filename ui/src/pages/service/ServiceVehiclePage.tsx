import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CarFront, ShieldCheck } from 'lucide-react';
import { getVehicleBundle, ticketsStore } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useStore } from '@/hooks/useStore';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { DataTable } from '@/components/common/DataTable';
import { DemoBadge } from '@/components/common/DemoBadge';
import { VehicleHeroCard } from '@/components/battery';
import { VehicleBatteryPanel } from '@/components/service/VehicleBatteryPanel';
import { ticketColumns } from '@/components/service/ticketColumns';
import { SERVICE_ROUTES, passportPath } from '@/constants/routes';
import { formatNumber, riskTone } from '@/utils/format';

export function ServiceVehiclePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: bundle, loading } = useAsync(() => getVehicleBundle(id), [id]);
  const tickets = useStore(ticketsStore).filter((t) => t.vehicleId === id);

  const back = (
    <button type="button" onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary">
      <ArrowLeft className="size-4" aria-hidden="true" /> Back
    </button>
  );

  if (loading) return <>{back}<PageSkeleton /></>;
  if (!bundle) {
    return (
      <>
        {back}
        <Card>
          <EmptyState icon={CarFront} title="Vehicle not found" description={`No vehicle with ID “${id}”.`} />
        </Card>
      </>
    );
  }
  const { vehicle: v, specs } = bundle;

  return (
    <>
      {back}
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">
        {v.year} {v.make} {v.model} <span className="font-normal text-muted">· battery & service record</span>
      </h1>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <div className="min-w-0 space-y-5">
          <Card className="p-0 sm:p-0" aria-labelledby="vt-title">
            <div className="p-5 pb-3 sm:p-6 sm:pb-3">
              <CardHeader titleId="vt-title" title="Service tickets for this vehicle" subtitle={`${tickets.length} on file`} className="mb-0" />
            </div>
            <DataTable
              rows={tickets}
              columns={ticketColumns({ compact: true })}
              getRowId={(t) => t.id}
              caption="Tickets for vehicle"
              onRowClick={(t) => navigate(SERVICE_ROUTES.ticket(t.id))}
              minWidth={560}
              empty={<EmptyState title="No tickets for this vehicle" />}
            />
          </Card>
          <VehicleBatteryPanel bundle={bundle} />
        </div>
        <aside className="min-w-0 space-y-5">
          <VehicleHeroCard
            vehicle={v}
            eyebrow="Vehicle & battery"
            badges={
              <>
                <Badge tone={riskTone(v.risk)}>{v.risk} risk</Badge>
                <DemoBadge />
              </>
            }
            details={[
              { label: 'VIN', value: <span className="font-mono text-xs">{v.vin}</span> },
              { label: 'Odometer', value: `${formatNumber(v.odometerMiles)} mi` },
              { label: 'Battery', value: `${specs.batteryKwh} kWh · ${specs.chemistry.split(' (')[0]}` },
              { label: 'Drivetrain', value: `${specs.motor} ${specs.drivetrain}` },
              { label: 'Max DC charging', value: `${specs.maxDcChargeKw} kW` },
            ]}
            actions={
              <Link to={passportPath('service', bundle.passportId)} className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-white hover:bg-secondary">
                <ShieldCheck className="size-4" aria-hidden="true" /> View Battery Passport
              </Link>
            }
          />
        </aside>
      </div>
    </>
  );
}
