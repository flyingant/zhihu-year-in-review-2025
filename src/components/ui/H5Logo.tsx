"use client";
import React from 'react';
import Image from 'next/image';

const H5Logo = ({ className = '' }) => {
  return (
    <div className={`relative z-50 ${className} flex justify-center pb-10`}>
      <Image
        src="/assets/h5_logo.png"
        alt="联合发布"
        width={640}
        height={400}
        className="object-contain"
      />
    </div>
  );
};

export default H5Logo;
