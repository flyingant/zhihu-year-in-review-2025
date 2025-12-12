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
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2' | 'step3'>('step1');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Compute video source based on current step
  const videoSrc = assets?.report?.intro
    ? currentStep === 'step1'
      ? assets.report.intro.step1.url
      : currentStep === 'step2'
      ? assets.report.intro.step2.url
      : assets.report.intro.step3.url
    : '';

  // Preload step2 and step3 videos
  useEffect(() => {
    if (!assets?.report?.intro) return;

    // Preload step2 video
    const step2Video = document.createElement('video');
    step2Video.src = assets.report.intro.step2.url;
    step2Video.preload = 'auto';
    step2Video.load();

    // Preload step3 video
    const step3Video = document.createElement('video');
    step3Video.src = assets.report.intro.step3.url;
    step3Video.preload = 'auto';
    step3Video.load();

    return () => {
      step2Video.src = '';
      step3Video.src = '';
    };
  }, [assets?.report?.intro]);

  // Handle video end event
  const handleVideoEnd = () => {
    if (currentStep === 'step1') {
      // Video 1 ended, automatically start step2 and loop it
      if (!assets?.report?.intro || !videoRef.current) return;
      
      const video = videoRef.current;
      
      // Wait for video to be ready before switching to avoid blink
      const handleCanPlayThrough = () => {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        setCurrentStep('step2');
        video.loop = true; // Enable looping for step2
        video.muted = false; // Enable sound for step2
        video.play().catch((error) => {
          console.error('Error playing video 2:', error);
        });
      };

      video.pause();
      video.currentTime = 0;
      
      const source = video.querySelector('source');
      if (source) {
        source.src = assets.report.intro.step2.url;
      }
      
      video.load();
      
      // Wait for video to be ready before switching
      if (video.readyState >= 3) {
        // Video is already ready (canplaythrough)
        handleCanPlayThrough();
      } else {
        video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
      }
    } else if (currentStep === 'step2') {
      // step2 is looping, so this shouldn't normally fire, but if it does, just replay
      // The loop attribute should handle this automatically
    } else if (currentStep === 'step3') {
      // After step3, go to next page
      onNext();
    }
  };

  // Play step3 video when button is clicked (stops step2 loop)
  const handleButtonClick = () => {
    if (!assets?.report?.intro || !videoRef.current || currentStep !== 'step2') return;
    
    const video = videoRef.current;
    
    // Wait for video to be ready before switching to avoid blink
    const handleCanPlayThrough = () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      setCurrentStep('step3');
      video.loop = false; // Disable looping for step3
      video.muted = false; // Keep sound enabled for step3
      video.play().catch((error) => {
        console.error('Error playing video 3:', error);
      });
    };

    video.pause();
    video.currentTime = 0;
    
    // Update source
    const source = video.querySelector('source');
    if (source) {
      source.src = assets.report.intro.step3.url;
    }
    
    // Load and wait for video to be ready
    video.load();
    
    // Wait for video to be ready before switching
    if (video.readyState >= 3) {
      // Video is already ready (canplaythrough)
      handleCanPlayThrough();
    } else {
      video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
    }
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
        {/* Single video element that plays all videos step by step */}
        {assets?.report?.intro && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-10"
            playsInline
            autoPlay
            muted={currentStep === 'step1'}
            loop={currentStep === 'step2'}
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
            style={{ background: 'transparent' }}
          >
            <source
              src={videoSrc}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Button to proceed to step3 (only show during step2 loop) */}
        {currentStep === 'step2' && (
          <button
            onClick={handleButtonClick}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-white/90 hover:bg-white text-black font-bold rounded-lg transition-all duration-200 shadow-lg"
          >
            继续
          </button>
        )}
      </div>
    </BaseScene>
  );
}

