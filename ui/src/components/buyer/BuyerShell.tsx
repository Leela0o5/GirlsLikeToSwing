import { Outlet } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { buyerPrefsStore } from '@/services';
import { CompareTray } from './CompareTray';

/** Wraps buyer pages so the comparison tray is available on every page. */
export function BuyerShell() {
  const { compare } = useStore(buyerPrefsStore);
  return (
    <div className={compare.length > 0 ? 'pb-20' : undefined}>
      <Outlet />
      <CompareTray />
    </div>
  );
}
