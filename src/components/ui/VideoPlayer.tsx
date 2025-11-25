"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { asset, assets } from '@/lib/assets';

interface VideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const footerImg = asset(assets.folders.footer) as { url: string; alt: string; width: number; height: number };

  return (
    <div 
      className={`w-full relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Background image for blend mode testing */}
      <div className="absolute inset-0 w-full overflow-hidden rounded-lg pointer-events-none">
        <Image
          src={footerImg.url}
          alt={footerImg.alt}
          width={footerImg.width}
          height={footerImg.height}
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover', minHeight: '100%' }}
        />
      </div>
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        className="w-full h-auto rounded-lg relative z-10"
        style={{ 
          mixBlendMode: 'screen',
          backgroundColor: 'transparent'
        }}
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;

