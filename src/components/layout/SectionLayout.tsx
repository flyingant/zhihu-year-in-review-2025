import React, { ReactNode } from 'react';

interface SectionLayoutProps {
  children: ReactNode;
  topOffset?: number;
  className?: string;
  id?: string;
}

/**
 * SectionLayout - A wrapper component to manage section positioning and spacing
 * @param children - The section component to wrap
 * @param topOffset - Vertical offset in pixels (default: 0)
 * @param className - Additional CSS classes
 * @param id - Optional section ID for navigation/scroll behavior
 */
const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  topOffset = 0,
  className = '',
  id,
}) => {
  return (
    <section
      id={id}
      className={`relative w-full ${className}`}
      style={{
        marginTop: `${topOffset}px`,
      }}
    >
      {children}
    </section>
  );
};

export default SectionLayout;

