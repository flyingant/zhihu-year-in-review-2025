'use client';

import React, { useEffect } from 'react';
import FlipDigit from './FlipDigit';
import { useSpring, useTransform } from 'framer-motion';

interface FlipCounterProps {
  value: number;
  className?: string; // For text styling (color, font size)
  style?: React.CSSProperties;
}

export default function FlipCounter({
  value,
  className,
  style,
}: FlipCounterProps) {
  // Use a spring to animate the number value
  const spring = useSpring(0, {
    duration: 10,
    bounce: 0,
  });

  const displayValue = useTransform(spring, (current) => Math.floor(current));
  const [digits, setDigits] = React.useState<string[]>(['0']);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    let lastUpdate = 0;
    const updateDigits = (val: number) => {
      setDigits(val.toString().split(''));
    };

    const unsubscribe = displayValue.on('change', (latest) => {
      const now = Date.now();
      // Throttle updates to allow flip animation to be visible
      // Using 100ms to strike balance between fluidity and visibility
      if (now - lastUpdate > 200) {
        updateDigits(Math.floor(latest));
        lastUpdate = now;
      }
    });

    const cleanupInterval = setInterval(() => {
      if (!spring.isAnimating()) {
        updateDigits(Math.floor(spring.get()));
      }
    }, 100);

    return () => {
      unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, [displayValue, spring, value]);

  const reversedDigits = [...digits].reverse();

  return (
    <div
      className={`inline-flex flex-row-reverse items-center gap-[1.5px] ${className}`}
      style={style}
    >
      {reversedDigits.map((d, i) => (
        <div
          key={i}
          style={{
            width: '28px',
            height: '44px',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            boxShadow: '3px 3px 0 rgba(0,0,0)',
          }}
        >
          <FlipDigit digit={d} />
        </div>
      ))}
    </div>
  );
}
