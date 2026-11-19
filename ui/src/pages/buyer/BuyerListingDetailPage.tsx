import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, FileQuestion, GitCompareArrows, Heart, Mail, ShieldCheck } from 'lucide-react';
import { MAX_COMPARE, buyerPrefsStore, getBatteryReport, toggleCompare, toggleSaved } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useStore } from '@/hooks/useStore';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { DemoBadge } from '@/components/common/DemoBadge';
import { KeyValueList } from '@/components/common/KeyValueList';
import {
  BatteryHealthCard,
  ServiceHistoryTimeline,
  TelemetryCard,
  VehicleDegradationCard,
  VehicleHeroCard,
  VerificationBadge,
} from '@/components/battery';
import { BUYER_ROUTES, passportPath } from '@/constants/routes';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
import { cn } from '@/utils/cn';

export function BuyerListingDetailPage() {
  const { id = '' } = useParams();
  const { data: report, loading } = useAsync(() => getBatteryReport(id), [id]);
  const prefs = useStore(buyerPrefsStore);
  const [contactOpen, setContactOpen] = useState(false);

  const back = (
    <Link to={BUYER_ROUTES.explore} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary">
      <ArrowLeft className="size-4" aria-hidden="true" /> Back to listings
    </Link>
  );

  if (loading) return <>{back}<PageSkeleton /></>;
  if (!report) {
    return (
      <>
        {back}
        <Card>
          <EmptyState icon={FileQuestion} title="Listing not found" description={`No listing exists with ID “${id}”.`} />
        </Card>
      </>
    );
  }

  const { listing: l, telemetry, degradation, serviceHistory } = report;
  const v = l.vehicle;
  const saved = prefs.saved.includes(l.id);
  const comparing = prefs.compare.includes(l.id);
  const priceGap = l.price - l.estTradeInValue;

  return (
    <>
      {back}
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <VerificationBadge status={l.verification} />
            <DemoBadge label="Demo battery report" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {v.year} {v.make} {v.model} <span className="font-normal text-muted">· {v.trim}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            Battery assessed {formatDate(l.assessedOn)} · Listed {formatDate(l.listedOn)} · {l.location}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 text-2xl font-semibold text-primary">{formatCurrency(l.price)}</p>
          <Button variant="outline" onClick={() => toggleSaved(l.id)} aria-pressed={saved}>
            <Heart className={cn(saved && 'fill-danger text-danger')} /> {saved ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant={comparing ? 'soft' : 'outline'}
            onClick={() => toggleCompare(l.id)}
            aria-pressed={comparing}
            disabled={!comparing && prefs.compare.length >= MAX_COMPARE}
          >
            {comparing ? <Check /> : <GitCompareArrows />} {comparing ? 'In comparison' : 'Compare'}
          </Button>
          <Link to={passportPath('buyer', l.passportId)} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-white hover:bg-secondary">
            <ShieldCheck className="size-4" aria-hidden="true" /> Battery Passport
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <div className="@container min-w-0 space-y-5">
          <BatteryHealthCard vehicle={v} lifeRemaining={l.estLifeRemaining} title="Battery Health Report" subtitle={`Assessment dated ${formatDate(l.assessedOn)} (simulated)`} />
          <VehicleDegradationCard vehicle={v} specs={l.specs} points={degradation} title="Battery Degradation History" />
          <TelemetryCard telemetry={telemetry} title="Temperature & Voltage at Assessment" />
          <Card aria-labelledby="records-title">
            <CardHeader titleId="records-title" title="Service & Maintenance Records" subtitle={`${serviceHistory.length} records on file (demo)`} />
            <ServiceHistoryTimeline records={serviceHistory} />
          </Card>
        </div>

        <aside className="grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-1" aria-label="Vehicle details">
          <Card aria-labelledby="verify-title">
            <CardHeader titleId="verify-title" title="Assessment & Verification" />
            <KeyValueList
              items={[
                { label: 'Assessment date', value: formatDate(l.assessedOn) },
                { label: 'Verification', value: <VerificationBadge status={l.verification} size="sm" /> },
                { label: 'Assessed by', value: 'Demo assessment centre' },
                { label: 'Passport ID', value: <span className="font-mono text-xs">{l.passportId.toUpperCase()}</span> },
              ]}
            />
            {l.verification !== 'Verified' && (
              <p className="mt-3 rounded-xl bg-warn-soft px-3 py-2 text-xs text-warn">
                {l.verification === 'Expired' ? 'This assessment is older than 6 months. Ask the seller for a new one.' : 'This assessment is awaiting review.'}
              </p>
            )}
          </Card>
          <Card aria-labelledby="value-title">
            <CardHeader titleId="value-title" title="Price & Value" subtitle="Battery-adjusted estimate (demo)" />
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-muted">Listing price</dt>
                <dd className="text-xl font-semibold text-ink">{formatCurrency(l.price)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Est. trade-in value</dt>
                <dd className="text-xl font-semibold text-primary">{formatCurrency(l.estTradeInValue)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted">
              Listing is {formatCurrency(Math.abs(priceGap))} {priceGap >= 0 ? 'above' : 'below'} the estimated trade-in value — typical retail margin is 10–20%.
            </p>
          </Card>
          <VehicleHeroCard
            vehicle={v}
            eyebrow="Specifications"
            details={[
              { label: 'Mileage', value: `${formatNumber(v.odometerMiles)} mi` },
              { label: 'VIN', value: <span className="font-mono text-xs">{v.vin}</span> },
              { label: 'Body', value: `${l.specs.bodyType} · ${l.specs.seats} seats` },
              { label: 'Drivetrain', value: `${l.specs.motor} ${l.specs.drivetrain}` },
              { label: 'Battery', value: `${l.specs.batteryKwh} kWh` },
              { label: 'Max DC charging', value: `${l.specs.maxDcChargeKw} kW` },
              { label: 'Range when new', value: `${l.specs.epaRangeNewMiles} mi` },
            ]}
            actions={
              <Button variant="soft" className="w-full" onClick={() => setContactOpen(true)}>
                <Mail /> Contact seller
              </Button>
            }
          />
        </aside>
      </div>

      <Dialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`Contact ${l.seller}`}
        description="Demo seller details — messaging is not enabled in this preview."
        footer={<Button onClick={() => setContactOpen(false)}>Close</Button>}
      >
        <KeyValueList
          items={[
            { label: 'Seller', value: l.seller },
            { label: 'Type', value: l.sellerType },
            { label: 'Location', value: l.location },
            { label: 'Reference', value: l.id.toUpperCase() },
          ]}
        />
        <p className="mt-4 text-xs text-muted">In production this would open a secure message thread with the seller.</p>
      </Dialog>
    </>
  );
}
