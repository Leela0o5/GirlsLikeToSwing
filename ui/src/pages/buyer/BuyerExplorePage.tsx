import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import type { KpiMetric, Listing } from '@/types';
import { getListings, matchesVehicleQuery } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NativeSelect } from '@/components/ui/field';
import { EmptyState, ErrorState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { KpiStrip } from '@/components/dashboard';
import { ListingCard } from '@/components/buyer/ListingCard';
import { formatCurrency } from '@/utils/format';

type SortKey = 'soh' | 'price-asc' | 'price-desc' | 'mileage' | 'newest';

interface Filters {
  make: string;
  minSoh: number;
  maxPrice: number;
  maxMileage: number;
  verifiedOnly: boolean;
  sort: SortKey;
}

const DEFAULT_FILTERS: Filters = { make: 'all', minSoh: 0, maxPrice: 0, maxMileage: 0, verifiedOnly: false, sort: 'soh' };

const sorters: Record<SortKey, (a: Listing, b: Listing) => number> = {
  soh: (a, b) => b.vehicle.sohPercent - a.vehicle.sohPercent,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  mileage: (a, b) => a.vehicle.odometerMiles - b.vehicle.odometerMiles,
  newest: (a, b) => b.listedOn.localeCompare(a.listedOn),
};

function FilterSelect({ label, value, onChange, children }: { label: string; value: string | number; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <label className="min-w-0 flex-1 basis-36">
      <span className="mb-1 block text-[11px] font-medium text-muted">{label}</span>
      <NativeSelect value={value} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-full bg-canvas text-xs">
        {children}
      </NativeSelect>
    </label>
  );
}

export function BuyerExplorePage() {
  const { data, loading, error } = useAsync(getListings, []);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));
  const setQuery = (q: string) => setParams(q ? { q } : {}, { replace: true });

  const listings = data ?? [];
  const makes = useMemo(() => [...new Set(listings.map((l) => l.vehicle.make))].sort(), [listings]);

  const filtered = useMemo(
    () =>
      listings
        .filter((l) => matchesVehicleQuery(l.vehicle, query) || l.location.toLowerCase().includes(query.toLowerCase()))
        .filter((l) => filters.make === 'all' || l.vehicle.make === filters.make)
        .filter((l) => l.vehicle.sohPercent >= filters.minSoh)
        .filter((l) => !filters.maxPrice || l.price <= filters.maxPrice)
        .filter((l) => !filters.maxMileage || l.vehicle.odometerMiles <= filters.maxMileage)
        .filter((l) => !filters.verifiedOnly || l.verification === 'Verified')
        .sort(sorters[filters.sort]),
    [listings, query, filters],
  );

  const isFiltered = query !== '' || JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
  const reset = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery('');
  };

  const verified = listings.filter((l) => l.verification === 'Verified').length;
  const kpis: KpiMetric[] = listings.length
    ? [
        { id: 'l', label: 'Available EVs', value: String(listings.length), icon: 'listings', delta: 'In the Columbus area', trend: 'flat', tone: 'neutral' },
        { id: 'v', label: 'Verified battery reports', value: String(verified), icon: 'verified', delta: `${listings.length - verified} pending or expired`, trend: 'flat', tone: 'positive' },
        { id: 's', label: 'Average SoH', value: String(Math.round(listings.reduce((s, l) => s + l.vehicle.sohPercent, 0) / listings.length)), unit: '%', icon: 'health', delta: 'Across all listings', trend: 'flat', tone: 'positive' },
        { id: 'p', label: 'Average price', value: formatCurrency(listings.reduce((s, l) => s + l.price, 0) / listings.length), icon: 'value', delta: 'Demo marketplace prices', trend: 'flat', tone: 'neutral' },
      ]
    : [];

  return (
    <>
      <PageHeader title="Explore EV Listings" description="Every listing includes a battery health report so you know what you’re buying." actions={<DemoBadge label="Demo listings" />} />
      {error && <ErrorState message="Unable to load listings." />}
      <div className="@container space-y-5">
        {kpis.length > 0 && <KpiStrip metrics={kpis} />}

        <section className="card p-4" aria-label="Search and filters">
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-0 flex-[2] basis-60">
              <span className="mb-1 block text-[11px] font-medium text-muted">Search</span>
              <span className="flex h-9 items-center gap-2 rounded-full border border-line bg-canvas px-3">
                <Search className="size-4 text-muted" aria-hidden="true" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Make, model, VIN or city" className="min-w-0 flex-1 bg-transparent text-xs focus:outline-none" />
                {query && (
                  <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted hover:text-ink">
                    <X className="size-3.5" />
                  </button>
                )}
              </span>
            </label>
            <FilterSelect label="Make" value={filters.make} onChange={(v) => set('make', v)}>
              <option value="all">All makes</option>
              {makes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Min battery health" value={filters.minSoh} onChange={(v) => set('minSoh', Number(v))}>
              <option value={0}>Any SoH</option>
              {[80, 85, 90, 95].map((n) => (
                <option key={n} value={n}>{n}%+</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Max price" value={filters.maxPrice} onChange={(v) => set('maxPrice', Number(v))}>
              <option value={0}>Any price</option>
              {[20000, 25000, 30000, 40000].map((n) => (
                <option key={n} value={n}>Up to {formatCurrency(n)}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Max mileage" value={filters.maxMileage} onChange={(v) => set('maxMileage', Number(v))}>
              <option value={0}>Any mileage</option>
              {[25000, 40000, 60000].map((n) => (
                <option key={n} value={n}>Up to {n / 1000}k mi</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Sort by" value={filters.sort} onChange={(v) => set('sort', v as SortKey)}>
              <option value="soh">Best battery health</option>
              <option value="price-asc">Lowest price</option>
              <option value="price-desc">Highest price</option>
              <option value="mileage">Lowest mileage</option>
              <option value="newest">Newest listings</option>
            </FilterSelect>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-ink">
              <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => set('verifiedOnly', e.target.checked)} className="size-4 accent-[#23865A]" />
              Verified battery reports only
            </label>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span aria-live="polite">
                <SlidersHorizontal className="mr-1 inline size-3.5" aria-hidden="true" />
                {loading ? 'Loading…' : `${filtered.length} of ${listings.length} vehicles`}
              </span>
              {isFiltered && (
                <Button variant="link" size="sm" onClick={reset} className="h-auto">
                  Reset filters
                </Button>
              )}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[440px] rounded-(--radius-card)" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={SearchX}
              title="No vehicles match your filters"
              description="Try lowering the minimum battery health or widening the price range."
              action={<Button variant="soft" size="sm" onClick={reset}>Reset filters</Button>}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
