import { useState, useCallback } from 'react';

export type UseLocalStorageReturn<T> = [
  T,
  (value: T | ((val: T) => T)) => void,
  () => void
];

/**
 * Custom hook for managing localStorage with React state synchronization
 * Provides safe error handling and TypeScript support
 */
export const useLocalStorage = <T>(
  key: string, 
  initialValue: T
): UseLocalStorageReturn<T> => {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      // SSR support - return initial value during server-side rendering
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Wrapped setter function that updates both state and localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Function to remove the item from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
