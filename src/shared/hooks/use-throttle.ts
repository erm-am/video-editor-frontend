import { useRef, useCallback } from 'react';

export const useThrottle = (fn, delay, dependencyList) => {
  const ref = useRef({ lastTime: 0 });
  return useCallback((...args) => {
    const now = Date.now();

    if (now - ref.current.lastTime >= delay) {
      fn(...args);
      ref.current.lastTime = now;
    }
  }, dependencyList);
};
