import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/common/StateViews';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  return (
    <Card>
      <EmptyState
        icon={MapPinOff}
        title="Page not found"
        description="The page you're looking for doesn't exist."
        action={
          <Link to={ROUTES.dashboard} className="text-sm font-medium text-secondary hover:text-primary">
            Go to dashboard
          </Link>
        }
      />
    </Card>
  );
}
