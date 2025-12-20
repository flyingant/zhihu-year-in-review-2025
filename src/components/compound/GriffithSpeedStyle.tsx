"use client";

import React from 'react';

export const GriffithSpeedStyle = () => (
  <style jsx global>{`
    .custom-speed-1x {
      /* 隐藏原有文字 */
      color: transparent !important;
      position: relative !important;
      
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      
      /* 避免高度塌陷或撑开 */
      vertical-align: middle !important;
    }

    .custom-speed-1x::after {
      content: '1.0x';
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      font-weight: 500;
      
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      
      display: flex;
      align-items: center;
      justify-content: center;
      
      pointer-events: none; 
      white-space: nowrap;
      
    }
  `}</style>
);