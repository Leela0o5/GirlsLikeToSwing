import { getDealerDashboard } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/StateViews';
import {
  BatteryPassportCard,
  BatteryTrendChart,
  DealerPerformanceCard,
  DealershipMap,
  KpiStrip,
  KpiStripSkeleton,
  RecommendationsPanel,
} from '@/components/dashboard';

function DashboardSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]" aria-busy="true" aria-label="Loading dashboard">
      <div className="@container space-y-5">
        <KpiStripSkeleton />
        <div className="grid gap-5 @2xl:grid-cols-2">
          <Skeleton className="h-[380px] rounded-(--radius-card)" />
          <Skeleton className="h-[380px] rounded-(--radius-card)" />
        </div>
        <Skeleton className="h-[440px] rounded-(--radius-card)" />
      </div>
      <div className="space-y-5">
        <Skeleton className="h-[420px] rounded-(--radius-card)" />
        <Skeleton className="h-[440px] rounded-(--radius-card)" />
      </div>
    </div>
  );
}

export function DealerDashboardPage() {
  const { data, loading, error } = useAsync(getDealerDashboard, []);

  return (
    <>
      <h1 className="sr-only">Dealer Dashboard</h1>
      {error && <ErrorState message="Unable to load dashboard data. Please try again." />}
      {loading && <DashboardSkeleton />}
      {data && (
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
          <div className="@container min-w-0 space-y-5">
            <KpiStrip metrics={data.kpis} />
            <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2">
              <DealerPerformanceCard data={data.performance} />
              <DealershipMap locations={data.locations} />
            </div>
            <BatteryTrendChart />
          </div>

          <aside className="grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-1" aria-label="Insights">
            <RecommendationsPanel recommendations={data.recommendations} />
            <BatteryPassportCard passport={data.featuredPassport} />
          </aside>
        </div>
      )}
    </>
  );
}
