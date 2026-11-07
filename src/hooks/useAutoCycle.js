import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Runs `onTick` every `intervalMs` unless `paused` or `prefers-reduced-motion` is active.
 */
export function useAutoCycle(onTick, intervalMs, paused = false) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || paused) return undefined;
    const timer = window.setInterval(onTick, intervalMs);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, paused, onTick, intervalMs]);

  return shouldReduceMotion;
}
