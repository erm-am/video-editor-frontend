import { useRef, useCallback } from 'react';

export const useThrottle = (fn, delay, dependence) => {
  const ref = useRef({ lastTime: 0 });
  return useCallback((...args) => {
    const now = Date.now();

    if (now - ref.current.lastTime >= delay) {
      fn(...args);
      ref.current.lastTime = now;
    }
  }, dependence);
};

//  const handleClick = useThrottle(() => setCount(count + 1), 500, [count]);
