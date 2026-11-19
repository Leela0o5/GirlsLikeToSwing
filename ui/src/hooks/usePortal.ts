import { createContext, useContext } from 'react';
import { PORTALS, type PortalConfig } from '@/constants/portals';

export const PortalContext = createContext<PortalConfig>(PORTALS.dealer);

export function usePortal(): PortalConfig {
  return useContext(PortalContext);
}
