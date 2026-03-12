import { useEffect, useState } from "react";

/**
 * Возвращает временное состояние, которое автоматически сбрасывается в null
 * через указанное время после последней установки значения.
 */
export function useTimedState<T>(
  duration: number,
): [T | null, (value: T) => void] {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    if (state === null) return;

    const timeoutId = window.setTimeout(() => setState(null), duration);
    return () => window.clearTimeout(timeoutId);
  }, [state, duration]);

  return [state, setState];
}
