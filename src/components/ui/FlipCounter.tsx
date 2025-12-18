'use client';

import React, { useEffect } from 'react';
import FlipDigit from './FlipDigit';

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
  // Start from 0 to ensure flip animation always triggers
  const [digits, setDigits] = React.useState<string[]>(['0']);

  useEffect(() => {
    // Update digits immediately when value changes
    // FlipDigit component will handle the flip animation
    setDigits(value.toString().split(''));
  }, [value]);

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
