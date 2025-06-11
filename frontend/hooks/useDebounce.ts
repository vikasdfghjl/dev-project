import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for debouncing values (e.g., search input)
 * Delays the execution of a callback until after a specified delay has passed
 */
export const useDebounce = <T>(
  value: T,
  delay: number,
  callback?: (debouncedValue: T) => void
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      // Call the callback with the debounced value
      if (callbackRef.current) {
        callbackRef.current(value);
      }
    }, delay);

    // Cleanup function to cancel the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
