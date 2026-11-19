import { Link } from 'react-router-dom';
import { BatteryMedium, ChevronRight, Clock4, Gauge, Info, ShieldCheck, Tag, Zap } from 'lucide-react';
import type { BatteryPassport } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DemoBadge } from '@/components/common/DemoBadge';
import { VehicleIllustration } from '@/components/common/VehicleIllustration';
import { StatItem as Stat } from '@/components/common/StatItem';
import { passportPath } from '@/constants/routes';
import { usePortal } from '@/hooks/usePortal';
import { formatCurrency, formatNumber, riskTone } from '@/utils/format';

export function BatteryPassportCard({ passport }: { passport: BatteryPassport }) {
  const v = passport.vehicle;
  const portal = usePortal();
  const riskColor = riskTone(v.risk) === 'positive' ? 'text-secondary' : riskTone(v.risk) === 'warning' ? 'text-warn' : 'text-danger';

  return (
    <Card className="@container" aria-labelledby="passport-title">
      <CardHeader
        titleId="passport-title"
        title="Battery Trust Passport"
        subtitle="EV trade-in asset"
        icon={
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-50 text-primary" aria-hidden="true">
            <ShieldCheck className="size-5" strokeWidth={1.75} />
          </span>
        }
        action={<Badge tone="solid">Battery Passport</Badge>}
      />

      <div className="rounded-2xl bg-canvas p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted">Vehicle trade-in</p>
            <p className="mt-1 text-lg font-semibold leading-snug text-ink">
              {v.year} {v.make} {v.model}
            </p>
            <p className="text-sm text-muted">{formatNumber(v.odometerMiles)} miles</p>
          </div>
          <DemoBadge className="shrink-0" />
        </div>
        <div className="relative mt-1">
          <VehicleIllustration className="mx-auto max-w-[240px]" />
          <span className="absolute bottom-1 right-1 rounded-lg bg-primary px-2 py-0.5 text-xs font-semibold text-white">
            SoH {v.sohPercent}%
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-line pt-3 @md:grid-cols-3">
          <Stat icon={BatteryMedium} label="Battery Health (SoH)" value={`${v.sohPercent}%`} />
          <Stat icon={Zap} label="State of Charge" value={`${v.socPercent}%`} />
          <Stat icon={Gauge} label="Est. Range" value={`${v.estRangeMiles} mi`} />
          <Stat icon={ShieldCheck} label="Risk Level" value={v.risk} valueClassName={riskColor} />
          <Stat icon={Tag} label="Est. Trade-in Value" value={formatCurrency(passport.estTradeInValue)} />
          <Stat icon={Clock4} label="Est. Battery Life Left" value={passport.estLifeRemaining} />
        </dl>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="flex min-w-0 items-center gap-1.5 text-muted">
          <Info className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Serial: {passport.batterySerial}</span>
        </span>
        <Link
          to={passportPath(portal.id, passport.id)}
          className="inline-flex items-center gap-0.5 font-semibold text-secondary hover:text-primary"
        >
          View Full Passport <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </footer>
      <p className="mt-2 text-[11px] text-muted">Sample values for demonstration. No battery diagnostic has been performed.</p>
    </Card>
  );
}
