import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton({ withSide = true }: { withSide?: boolean }) {
  return (
    <div className={withSide ? 'grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]' : 'grid gap-5'} aria-busy="true" aria-label="Loading">
      <div className="space-y-5">
        <Skeleton className="h-[120px] rounded-(--radius-card)" />
        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-[340px] rounded-(--radius-card)" />
          <Skeleton className="h-[340px] rounded-(--radius-card)" />
        </div>
        <Skeleton className="h-[380px] rounded-(--radius-card)" />
      </div>
      {withSide && (
        <div className="space-y-5">
          <Skeleton className="h-[420px] rounded-(--radius-card)" />
          <Skeleton className="h-[300px] rounded-(--radius-card)" />
        </div>
      )}
    </div>
  );
}
