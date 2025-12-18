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

  // If stable (no change recently), just show static
  // But to animate, we rely on the key changing for the animation block

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{ ...style, perspective: '500px' }}
    >
      {/* Static Background (Target Number) */}
      {/* Top Half of Current (Wait, if we are flipping, static background should be the TARGET completely?) 
          Standard approach:
          1. Static layer: Shows TARGET (Top and Bottom).
          2. Flap layer: 
             - Front (Top half of PREV).
             - Back (Bottom half of TARGET).
          Animation: Flap rotates down.
          Start: Front visible (PREV Top). Bottom half of TARGET is visible (Wait, inconsistent).
          
          Correct Layout:
          Base Layer Top: TARGET Top
          Base Layer Bottom: TARGET Bottom
          
          Flap Layer (Rotates):
          - Front face: PREV Top
          - Back face: TARGET Bottom (Initially hidden, appears when flip > 90)
          
          Wait, there's also the "PREV Bottom" that needs to be visible at start.
          So we need:
          1. Static Bottom: PREV Bottom (Visible at start).
          2. Static Top: TARGET Top (Visible at end, but covered by Flap Front at start).
          
          Actually, easier:
          UPPER HALF:
            - Behind: TARGET Top.
            - Front: PREV Top (The Flap).
          LOWER HALF:
            - Behind: PREV Bottom.
            - Front: TARGET Bottom (The Flap's Back).
            
          Wait, the flap consists of PREV Top and TARGET Bottom.
          It rotates 0 -> -180.
          
          Let's verify visual stack:
          Top Half Zone:
             - Bottom Z: TARGET Top.
             - Top Z: PREV Top (Flap Front).
          Bottom Half Zone:
             - Bottom Z: PREV Bottom.
             - Top Z: TARGET Bottom (Flap Back).
             
          When Flap rotates:
             PREV Top rotates down, revealing TARGET Top.
             PREV Top becomes TARGET Bottom (backside) and covers PREV Bottom.
             
          So:
          Static Lower: PREV Bottom.
          Static Upper: TARGET Top.
          Moving Element:
             Front: PREV Top.
             Back: TARGET Bottom.
             
          Since React re-renders fast, handling "Prev" state is tricky if we don't control the animation queue. 
          But here we just restart animation on change.
          
          Wait, if digit changes 1->2. 'current' becomes 2, 'prev' becomes 1.
          Static Lower: 1 (Prev).
          Static Upper: 2 (Target).
          Flap Front: 1 (Prev).
          Flap Back: 2 (Target).
          
          This works for 1 transition.
          For the NEXT transition 2->3.
          We need '1' to be gone. static lower is now '2'. 
          
          So:
          current = digit (TARGET).
          prev = stored prev.
      */}

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
