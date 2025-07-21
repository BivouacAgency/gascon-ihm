import { useState, useEffect } from "react";

/**
 * useStale
 * @param resetTrigger - value to watch for resets (e.g., timestamp or message ID)
 * @param thresholdMs - milliseconds after which data is considered stale
 * @returns boolean indicating if data is stale
 */
export function useStale(resetTrigger: unknown, thresholdMs = 5000): boolean {
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    // Reset stale state on trigger change
    setIsStale(false);
    const timeoutId = setTimeout(() => {
      setIsStale(true);
    }, thresholdMs);
    return () => clearTimeout(timeoutId);
  }, [resetTrigger, thresholdMs]);

  return isStale;
} 