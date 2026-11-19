import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Listing } from '@/types';
import { buyerPrefsStore, getListingSync } from '@/services';
import { useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { ListingCard } from '@/components/buyer/ListingCard';
import { BUYER_ROUTES } from '@/constants/routes';

export function BuyerSavedPage() {
  const { saved } = useStore(buyerPrefsStore);
  const list = saved.map(getListingSync).filter((l): l is Listing => Boolean(l));

  return (
    <>
      <PageHeader title="Saved Vehicles" description={`${list.length} saved · stored in this browser only (demo).`} />
      {list.length === 0 ? (
        <Card>
          <EmptyState
            icon={Heart}
            title="No saved vehicles"
            description="Tap the heart on a listing to keep it here."
            action={
              <Link to={BUYER_ROUTES.explore} className="text-sm font-medium text-secondary hover:text-primary">
                Explore listings →
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="@container">
          <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2 @5xl:grid-cols-3">
            {list.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
