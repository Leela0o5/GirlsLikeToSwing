import { useEffect, type RefObject } from 'react';

/** Calls `onOutside` on pointer-down outside `ref`, or when Escape is pressed. */
export function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handlePointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOutside();
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, onOutside, enabled]);
}
