import { useEffect } from "react";

export function useGlobalPointer(handler: (ev: PointerEvent) => void, ignoreSelector = 'button, input, textarea, select') {
  useEffect(() => {
    const onPointer = (ev: PointerEvent) => {
      const target = ev.target as Element | null;
      if (target && target.closest(ignoreSelector)) return;
      handler(ev);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [handler, ignoreSelector]);
}
