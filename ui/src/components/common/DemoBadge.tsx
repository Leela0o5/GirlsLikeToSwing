import { FlaskConical } from 'lucide-react';
import { BRAND } from '@/constants/brand';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

interface DemoBadgeProps {
  className?: string;
  label?: string;
}

/** Marks any value as simulated, per the "label everything as demo" requirement. */
export function DemoBadge({ className, label = 'Demo data' }: DemoBadgeProps) {
  return (
    <Badge tone="warning" size="sm" className={cn('uppercase tracking-wide', className)} title={BRAND.demoNotice}>
      <FlaskConical aria-hidden="true" />
      {label}
    </Badge>
  );
}
