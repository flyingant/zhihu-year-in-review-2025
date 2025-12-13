"use client";

import React from 'react';
import Image from 'next/image';

import { useAssets } from '@/context/assets-context';

interface FollowButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  disabled = false, 
  onClick,
  className = ''
}) => {
  const { assets } = useAssets();

  if (!assets) return null;

  const activeImageSrc = assets.report.p16.subscribe.url;
  const disabledImageSrc = assets.report.p16.subscribed.url;
  const {width, height} = assets.report.p16.subscribe;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
        ${className}
      `}
    >
      <Image
        src={disabled ? disabledImageSrc : activeImageSrc}
        alt={disabled ? '已关注' : '+关注'}
        width={width}
        height={height}
        className="object-contain"
      />
    </button>
  );
};

export default FollowButton;
