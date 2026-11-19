import type { ReactNode } from 'react';
import type { Vehicle } from '@/types';
import { Card } from '@/components/ui/card';
import { VehicleIllustration } from '@/components/common/VehicleIllustration';
import { KeyValueList, type KeyValue } from '@/components/common/KeyValueList';
import { formatNumber } from '@/utils/format';

interface VehicleHeroCardProps {
  vehicle: Vehicle;
  eyebrow?: string;
  details?: KeyValue[];
  badges?: ReactNode;
  actions?: ReactNode;
}

export function VehicleHeroCard({ vehicle: v, eyebrow, details = [], badges, actions }: VehicleHeroCardProps) {
  return (
    <Card aria-label={`${v.year} ${v.make} ${v.model}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="text-xs text-muted">{eyebrow}</p>}
          <h2 className="mt-0.5 text-xl font-semibold leading-snug tracking-tight text-ink">
            {v.year} {v.make} {v.model}
          </h2>
          <p className="text-sm text-muted">
            {v.trim} · {formatNumber(v.odometerMiles)} miles
          </p>
        </div>
        {badges && <div className="flex shrink-0 flex-col items-end gap-1.5">{badges}</div>}
      </div>
      <div className="my-3 rounded-2xl bg-gradient-to-b from-canvas to-brand-50/50 px-4 py-2">
        <VehicleIllustration className="mx-auto max-w-[280px]" />
      </div>
      {details.length > 0 && <KeyValueList items={details} />}
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
