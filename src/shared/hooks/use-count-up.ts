"use client";

import * as React from "react";
import { ANIMATION } from "@app/shared/config/config";

export function useCountUp(target: number, duration: number = ANIMATION.SLOW): number {
  const [current, setCurrent] = React.useState(0);
  const previousTargetRef = React.useRef(0);
  const rafRef = React.useRef<number>(undefined);

  React.useEffect(() => {
    const startValue = previousTargetRef.current;
    previousTargetRef.current = target;

    if (target === 0 && startValue === 0) {
      return;
    }

    const startTime = performance.now();
    const diff = target - startValue;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(Math.round(startValue + diff * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return current;
}
