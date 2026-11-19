import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import type { PortalId } from '@/types';
import { PORTALS } from '@/constants/portals';
import { PortalContext } from '@/hooks/usePortal';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

interface DashboardLayoutProps {
  portal?: PortalId;
}

export function DashboardLayout({ portal = 'dealer' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const config = PORTALS[portal];

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <PortalContext.Provider value={config}>
      <div className="min-h-full">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:shadow-pop">
          Skip to content
        </a>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen min-w-0 flex-col lg:pl-[264px]">
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} menuOpen={sidebarOpen} />
          <main id="main" className="flex-1 px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center text-muted" role="status">
                  <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                  <span className="sr-only">Loading page</span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </PortalContext.Provider>
  );
}
