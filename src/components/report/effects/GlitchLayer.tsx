import React from 'react';

type GlitchIntensity = 'light' | 'heavy' | 'none';

interface GlitchLayerProps {
  children: React.ReactNode;
  intensity?: GlitchIntensity;
  className?: string;
}

export default function GlitchLayer({ 
  children, 
  intensity = 'light', 
  className = '' 
}: GlitchLayerProps) {
  
  const intensityClass = {
    'light': '[&_img]:animate-glitch-light', 
    'heavy': '[&_img]:animate-glitch-heavy',
    'none': ''
  }[intensity];

  const delayClasses = [
    '[&_img:nth-of-type(1)]:[animation-delay:1000ms]', 
    '[&_img:nth-of-type(2)]:[animation-delay:2500ms]',
    '[&_img:nth-of-type(3)]:[animation-delay:500ms]',
    '[&_img:nth-of-type(4)]:[animation-delay:2000ms]',
    '[&_img:nth-of-type(5)]:[animation-delay:3000ms]',
  ].join(' ');

  return (
    <div 
      className={`
        absolute inset-0 z-[-1]
        ${className} 
        ${intensityClass} 
        ${intensity !== 'none' ? delayClasses : ''}
      `}
    >
      {children}
    </div>
  );
}