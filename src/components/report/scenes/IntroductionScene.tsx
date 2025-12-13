"use client";

// components/report/scenes/IntroductionScene.tsx
import { useState, useRef, useEffect } from 'react';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import Image from "next/image";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

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

  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = assets.report.bg.blue0_1;
  const blue2Asset = assets.report.bg.blue0_2;
  const blue3Asset = assets.report.bg.blue0_3;
  const blue4Asset = assets.report.bg.blue0_4;
  const greenAsset = assets.report.bg.green0;
  const mix1Asset = assets.report.bg.mix0_1;
  const mix2Asset = assets.report.bg.mix0_2;
  const mix3Asset = assets.report.bg.mix0_3;
  const mix4Asset = assets.report.bg.mix0_4;
  const mix5Asset = assets.report.bg.mix0_5;
  const mixintro_1Asset = assets.report.bg.mixintro_1;
  const mixintro_2Asset = assets.report.bg.mixintro_2;

  const introTitleAsset = assets.report.intro.title;
  const introButtonAsset = assets.report.intro.button;

  return (
    <BaseScene 
      onNext={onNext} 
      sceneName={sceneName}
      className="pt-0"
      containerClassName="w-full max-w-none"
      contentClassName="p-0"
    >
      <GlitchLayer intensity='heavy' className='z-[50]'>
        {/* 顺序从上到下 */}
        <Image src={mix2Asset.url} alt="{mix2Asset.alt}" width={mix2Asset.width} height={mix2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ top: '90px', right: '0px' }} />
        <Image src={mix1Asset.url} alt="{mix1Asset.alt}" width={mix1Asset.width} height={mix1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ top: '188px', right: '16px' }} />
        <Image src={blue2Asset.url} alt="{blue2Asset.alt}" width={blue2Asset.width} height={blue2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ top: '253px', right: '93px' }} />
        <Image src={mix3Asset.url} alt="{mix3Asset.alt}" width={mix3Asset.width} height={mix3Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ top: '213px', right: '3px' }} />
        <Image src={blue3Asset.url} alt="{blue3Asset.alt}" width={blue3Asset.width} height={blue3Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ top: '306px', left: '144px' }} />
        <Image src={mixintro_1Asset.url} alt="{mixintro_1Asset.alt}" width={mixintro_1Asset.width} height={mixintro_1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ top: '323px', right: '0px' }} />
        <Image src={mix5Asset.url} alt="{mix5Asset.alt}" width={mix5Asset.width} height={mix5Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ bottom: '283px', right: '70px' }} />     
        <Image src={mixintro_2Asset.url} alt="{mixintro_2Asset.alt}" width={mixintro_2Asset.width} height={mixintro_2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" 
          style={{ bottom: '147px', right: '0px' }} />
         <Image src={greenAsset.url} alt="{greenAsset.alt}" width={greenAsset.width} height={greenAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1 scale-75" 
          style={{ bottom: '14px', right: '-15px' }} />
      </GlitchLayer>
      <div className='z-[50] absolute inset-0'>
        <Image src={introTitleAsset.url} alt="{introTitleAsset.alt}" width={introTitleAsset.width} height={introTitleAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1" style={{top: '100px', left: '50%', transform: 'translateX(-50%)'}} />
      </div>
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
          <Image onClick={handleButtonClick} src={introButtonAsset.url} alt="{introButtonAsset.alt}" width={introButtonAsset.width} height={introButtonAsset.height} 
            className="animate-wiggle-x object-contain absolute select-none z-50" style={{bottom: '86px', left: '58px'}} />
        )}
      </div>
    </BaseScene>
  );
}

