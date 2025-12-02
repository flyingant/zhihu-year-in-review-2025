'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

const GRID_COLS = 8;
const GRID_ROWS = 12;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

export default function PixelGlitchOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: TOTAL_CELLS }).map((_, i) => (
        <GlitchCell key={i} />
      ))}
    </div>
  );
}

const GlitchCell = () => {
  const config = useMemo(() => {
    // 增加活跃度，因为现在是“露出”效果，多一点才好看
    const isActive = Math.random() < 0.2;

    return {
      isActive,
      // 随机时长
      duration: Math.random() * 1.5 + 0.5,
      // 随机延迟
      delay: Math.random() * 5,
    };
  }, []);

  if (!config.isActive) {
    return <div className="w-full h-full bg-white" />;
  }

  return (
    <motion.div
      className="w-full h-full bg-white"
      initial={{ opacity: 1 }}
      animate={{
        opacity: [1, 0, 1, 0, 1],
      }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        repeatType: "loop",
        delay: config.delay,
        ease: "linear",
        repeatDelay: Math.random() * 3 + 2
      }}
    />
  );
};