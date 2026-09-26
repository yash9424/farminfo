"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts from 0 to `value` when scrolled into view. The final value is rendered
 * on the server, so the number is correct without JS and for screen readers.
 */
export function CountUp({
  value,
  duration = 1.6,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;
    const fmt = new Intl.NumberFormat("en-IN");
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${fmt.format(Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat("en-IN").format(value)}
      {suffix}
    </span>
  );
}
