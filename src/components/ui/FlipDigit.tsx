'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipDigitProps {
  digit: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function FlipDigit({
  digit,
  className = '',
  style = {},
}: FlipDigitProps) {
  const [currentInfo, setCurrentInfo] = useState({
    current: digit,
    prev: digit,
  });

  if (digit !== currentInfo.current) {
    setCurrentInfo((prev) => ({
      current: digit,
      prev: prev.current,
    }));
  }

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{ ...style, perspective: '500px' }}
    >
      <div className='relative w-full h-full'>
        {/* We use a key to force re-mounting animation on change */}
        <SingleFlip
          key={`${currentInfo.prev}-${currentInfo.current}`}
          prev={currentInfo.prev}
          current={currentInfo.current}
        />
      </div>
    </div>
  );
}

function SingleFlip({
  prev,
  current,
}: {
  prev: string | number;
  current: string | number;
}) {
  const isDiff = true;

  return (
    <div className='relative w-full h-full user-select-none'>
      {/* Permanent Static Backgrounds (The "Under" layers) */}

      {/* UPPER UNDER: Current (Target) Top */}
      <div className='absolute top-0 left-0 w-full h-[50%] overflow-hidden bg-white border-[2px] border-black border-b-0 flex justify-center items-end box-border '>
        <span className='translate-y-[50%]'>{current}</span>
      </div>

      {/* LOWER UNDER: Prev Bottom */}
      <div className='absolute bottom-0 left-0 w-full h-[50%] overflow-hidden bg-white border-[2px] border-black border-t-0 flex justify-center items-start box-border '>
        <span className='-translate-y-[50%]'>{prev}</span>
      </div>

      {/* The Flap (Top Half -> Rotates to Bottom Half) */}
      {/* Only animate if diff */}
      <motion.div
        initial={isDiff ? { rotateX: 0 } : false}
        animate={isDiff ? { rotateX: -180 } : false}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        style={{ transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}
        className='absolute top-0 left-0 w-full h-[50%] z-10 pointer-events-none'
      >
        {/* FLAP FRONT: Prev Top */}
        <div
          className='absolute top-0 left-0 w-full h-full overflow-hidden bg-white border-[2px] border-black border-b-0 flex justify-center items-end box-border '
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className='translate-y-[50%]'>{prev}</span>
        </div>

        {/* FLAP BACK: Current (Target) Bottom */}
        <div
          className='absolute top-0 left-0 w-full h-full overflow-hidden bg-white border-[2px] border-black border-t-0 flex justify-center items-start box-border '
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
          }}
        >
          <span className='-translate-y-[50%]'>{current}</span>
        </div>
      </motion.div>
    </div>
  );
}
