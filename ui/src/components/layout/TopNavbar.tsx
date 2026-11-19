import { Menu } from 'lucide-react';
import { Logo, LogoMark } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { usePortal } from '@/hooks/usePortal';
import { SearchBar } from './SearchBar';
import { NotificationPanel } from './NotificationPanel';
import { ProfileMenu } from './ProfileMenu';

interface TopNavbarProps {
  onMenuClick: () => void;
  menuOpen: boolean;
}

export function TopNavbar({ onMenuClick, menuOpen }: TopNavbarProps) {
  const portal = usePortal();
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-canvas/85 backdrop-blur-md">
      <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:h-[92px] lg:gap-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="text-ink lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
        >
          <Menu />
        </Button>

        <LogoMark className="size-9 sm:hidden" />
        <Logo className="hidden shrink-0 sm:flex xl:min-w-[230px]" tagline={portal.tagline} />

        <SearchBar className="mx-auto hidden max-w-xl md:block" />

        <div className="ml-auto flex items-center gap-1 sm:gap-3 md:ml-0">
          <NotificationPanel />
          <ProfileMenu />
        </div>
      </div>
      <div className="px-4 pb-3 sm:px-6 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
