import { useState, useEffect } from "react";

/**
 * Custom React hook to debounce a value.
 * @param value The input value to debounce.
 * @param delay Debounce delay in milliseconds.
 * @returns The debounced value.
 */
function useDebounce(value: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update debouncedValue after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up if value or delay changes, or on unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
