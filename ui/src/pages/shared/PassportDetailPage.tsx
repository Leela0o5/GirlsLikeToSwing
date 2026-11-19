import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { getBatteryPassport } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/StateViews';
import { DemoBadge } from '@/components/common/DemoBadge';
import { CircularProgress } from '@/components/common/CircularProgress';
import { VehicleIllustration } from '@/components/common/VehicleIllustration';
import { usePortal } from '@/hooks/usePortal';
import { ModuleVoltageBars } from '@/components/battery';
import { BRAND } from '@/constants/brand';
import { formatCurrency, formatDate, formatNumber, riskTone } from '@/utils/format';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/70 py-2.5 text-sm last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="whitespace-nowrap text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

export function PassportDetailPage() {
  const { id = '' } = useParams();
  const portal = usePortal();
  const { data: p, loading } = useAsync(() => getBatteryPassport(id), [id]);

  const back = (
    <Link to={portal.basePath} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary">
      <ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard
    </Link>
  );

  if (loading) {
    return (
      <>
        {back}
        <div className="grid gap-5 lg:grid-cols-3" aria-busy="true">
          <Skeleton className="h-[420px] rounded-(--radius-card)" />
          <Skeleton className="h-[420px] rounded-(--radius-card) lg:col-span-2" />
        </div>
      </>
    );
  }

  if (!p) {
    return (
      <>
        {back}
        <Card>
          <EmptyState icon={FileQuestion} title="Passport not found" description={`No battery passport exists with ID “${id}”.`} />
        </Card>
      </>
    );
  }

  const v = p.vehicle;

  return (
    <>
      {back}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Battery Trust Passport · {v.year} {v.make} {v.model}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Passport {p.id.toUpperCase()} · Issued {formatDate(p.issuedAt)}
          </p>
        </div>
        <DemoBadge label="Sample passport — demo data" />
      </div>

      <p className="mb-5 rounded-2xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-warn">{BRAND.demoNotice}</p>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Card aria-labelledby="pp-vehicle">
          <CardHeader titleId="pp-vehicle" title="Vehicle" subtitle={v.trim} />
          <div className="rounded-2xl bg-canvas p-4">
            <VehicleIllustration />
          </div>
          <dl className="mt-3">
            <Row label="VIN" value={v.vin} />
            <Row label="Odometer" value={`${formatNumber(v.odometerMiles)} miles`} />
            <Row label="Battery serial" value={p.batterySerial} />
            <Row label="Chemistry" value={p.chemistry} />
          </dl>
        </Card>

        <div className="grid gap-5 lg:col-span-2">
          <Card aria-labelledby="pp-health">
            <CardHeader titleId="pp-health" title="Battery health summary" />
            <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
              <div className="flex justify-center gap-5">
                <CircularProgress value={v.sohPercent} size={110} stroke={9} label="State of health">
                  <span className="text-2xl font-semibold text-primary">{v.sohPercent}%</span>
                  <span className="text-[10px] text-muted">SoH</span>
                </CircularProgress>
                <CircularProgress value={v.socPercent} size={110} stroke={9} color="var(--color-lime)" label="State of charge">
                  <span className="text-2xl font-semibold text-ink">{v.socPercent}%</span>
                  <span className="text-[10px] text-muted">SoC</span>
                </CircularProgress>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
                <Row label="Estimated range" value={`${v.estRangeMiles} miles`} />
                <Row label="Risk level" value={v.risk} />
                <Row label="Est. trade-in value" value={formatCurrency(p.estTradeInValue)} />
                <Row label="Est. battery life left" value={p.estLifeRemaining} />
                <Row label="Usable / nominal" value={`${p.usableCapacityKwh} / ${p.nominalCapacityKwh} kWh`} />
                <Row label="Charge cycles" value={formatNumber(p.cycleCount)} />
                <Row label="DC fast-charge share" value={`${p.fastChargeShare}%`} />
                <Row label="Avg. cell temperature" value={`${p.avgCellTempC} °C`} />
              </dl>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge tone={riskTone(v.risk)}>Risk: {v.risk}</Badge>
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <Card aria-labelledby="pp-cells">
              <CardHeader titleId="pp-cells" title="Module voltage balance" />
              <ModuleVoltageBars modules={p.cellBalance} />
            </Card>

            <Card aria-labelledby="pp-history">
              <CardHeader titleId="pp-history" title="Passport history" />
              <ol className="relative space-y-4 border-l border-line pl-5">
                {p.history.map((h) => (
                  <li key={h.date + h.event} className="relative">
                    <span className="absolute -left-[25px] top-1 size-2.5 rounded-full border-2 border-white bg-secondary ring-1 ring-secondary/30" />
                    <p className="text-sm font-medium text-ink">{h.event}</p>
                    <p className="text-xs text-muted">
                      {formatDate(h.date)} · {h.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
