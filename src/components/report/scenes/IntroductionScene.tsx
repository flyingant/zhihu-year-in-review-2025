"use client";

// components/report/scenes/IntroductionScene.tsx
import { useState, useRef, useEffect } from 'react';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';

interface IntroductionSceneProps {
  onNext: () => void;
  sceneName?: string;
}

export default function IntroductionScene({ onNext, sceneName }: IntroductionSceneProps) {
  const { assets } = useAssets();
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>('step1');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video end event
  const handleVideoEnd = () => {
    if (currentStep === 'step1') {
      // Video 1 ended, button is already displayed for user to proceed
    } else if (currentStep === 'step2') {
      // After step2, go to next page
      onNext();
    }
  };

  // Play step2 video when button is clicked
  const handleButtonClick = () => {
    if (!assets?.report?.intro || !videoRef.current) return;
    
    // Switch to step2 video
    setCurrentStep('step2');
    
    // Change video source and play
    const video = videoRef.current;
    video.pause();
    video.currentTime = 0;
    
    // Update source
    const source = video.querySelector('source');
    if (source) {
      source.src = assets.report.intro.step2.url;
    }
    
    // Load and play the new video
    video.load();
    video.muted = false; // Enable sound for step2 (user-initiated)
    
    video.play().catch((error) => {
      console.error('Error playing video 2:', error);
    });
  };

  // Auto-play step1 video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !assets?.report?.intro) return;

    const handleLoadedData = () => {
      video.play().catch((error) => {
        console.error('Error playing video 1:', error);
      });
    };

    // If video is already loaded, play immediately
    if (video.readyState >= 2) {
      handleLoadedData();
    } else {
      video.addEventListener('loadeddata', handleLoadedData);
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [assets?.report?.intro]);

  return (
    <BaseScene 
      onNext={onNext} 
      sceneName={sceneName}
      className="pt-0"
      containerClassName="w-full max-w-none"
      contentClassName="p-0"
    >
      <div className="relative w-full h-full overflow-hidden bg-black">
        {/* Single video element that plays both videos step by step */}
        {assets?.report?.intro && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-10"
            playsInline
            autoPlay
            muted={currentStep === 'step1'}
            preload="auto"
            onLoadedData={() => {
              // Ensure video plays when loaded
              if (videoRef.current && currentStep === 'step1') {
                videoRef.current.play().catch((error) => {
                  console.error('Error playing video on load:', error);
                });
              }
            }}
            onEnded={handleVideoEnd}
          >
            <source
              src={
                currentStep === 'step1'
                  ? assets.report.intro.step1.url
                  : assets.report.intro.step2.url
              }
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Button to proceed to step2 */}
        <button
          onClick={handleButtonClick}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-white/90 hover:bg-white text-black font-bold rounded-lg transition-all duration-200 shadow-lg"
        >
          继续
        </button>
      </div>
    </BaseScene>
  );
}

