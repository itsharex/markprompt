import { useEffect, useLayoutEffect, useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [isMounted, setIsMounted] = useState(false);

  const isServer = typeof window === 'undefined';
  const useEffectFn = !isServer ? useLayoutEffect : useEffect;

  useEffectFn(() => {
    setIsMounted(true);
  }, []);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.error('Error getting value from localStorage', e);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (e) {
      console.error('Error writing value to localStorage', e);
    }
  };

  return [isMounted ? storedValue : initialValue, setValue];
};
