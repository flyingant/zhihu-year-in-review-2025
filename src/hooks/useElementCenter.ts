import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView, IntersectionOptions } from 'react-intersection-observer';

export const useElementCenter = (options: IntersectionOptions = { threshold: 0.5 }) => {
  const [isCenter, setIsCenter] = useState(false);

  const manualRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView(options);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      manualRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!manualRef.current) return;

      const rect = manualRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      const isCoveringCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;

      setIsCenter(isCoveringCenter);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return {
    ref: setRefs,
    isCenter,
    inView
  };
};