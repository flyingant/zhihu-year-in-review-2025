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
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAgreementDialogOpen, setIsAgreementDialogOpen] = useState(false);
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

  useEffect(() => {
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.invoke("getNetworkType", {}, function () {
        videoRef.current?.play();
      });
    }
  }, [currentStep]);

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
    
    // If not agreed, open the dialog instead
    if (!isAgreed) {
      setIsAgreementDialogOpen(true);
      return;
    }
    
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
      showBottomNextButton={false}
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
          style={{ bottom: '223px', right: '60px' }} />     
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
      <div className="relative w-full h-full overflow-hidden bg-transparent">
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
          <div className="absolute z-50" style={{bottom: '44px', left: '63px'}}>
            <Image 
              onClick={handleButtonClick} 
              src={introButtonAsset.url} 
              alt={introButtonAsset.alt} 
              width={introButtonAsset.width} 
              height={introButtonAsset.height} 
              className={`object-contain select-none cursor-pointer ${isAgreed ? 'animate-wiggle-x' : ''}`}
            />
            {/* Checkbox with text below the button */}
            <div className="flex items-center gap-2 mt-3" style={{width: introButtonAsset.width + 40}}>
              <input
                type="checkbox"
                id="data-agreement"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-4 h-4 cursor-pointer flex-shrink-0"
              />
              <label 
                htmlFor="data-agreement" 
                className="text-black text-xs font-normal cursor-pointer leading-tight"
                style={{fontWeight: '100'}}
                onClick={(e) => {
                  e.stopPropagation();
                  // Open dialog instead of toggling checkbox directly
                  setIsAgreementDialogOpen(true);
                }}
              >
                同意访问数据查看你的「2025真实源文件」
              </label>
            </div>
            <p className="text-black font-normal mt-3 text-center" style={{fontSize: '10px', fontWeight: '100'}}>数据截止至2025年12月21日</p>
          </div>
        )}
      </div>

      {/* Agreement Terms Dialog */}
      {isAgreementDialogOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 animate-overlayShow"
          style={{fontFamily: "PingFang SC"}}
          onClick={() => {
            setIsAgreementDialogOpen(false);
            setIsAgreed(false);
          }}
        >
          <div 
            className="bg-white w-[90vw] max-w-[400px] rounded-[16px] overflow-hidden flex flex-col animate-contentShow max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="text-lg font-bold text-[#191b1f] text-center">
                2025知乎个人年度报告授权协议
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="text-sm text-[#373a40] leading-relaxed space-y-4">
                {/* Rich text formatted agreement content */}
                <div className="agreement-content">
                  {/* Introduction */}
                  <p className="mb-4 text-[#191b1f]">
                    感谢您阅读《2025 知乎个人年度报告授权协议》！
                  </p>
                  <p className="mb-4">
                    您正式使用 2025 知乎个人年度报告----「我的 2025 真实源文件」（下称&ldquo;本服务&rdquo;）之前应仔细阅读并充分理解本协议中的全部内容，如您不同意本协议中的任何条款，请立即停止使用本服务。您使用本服务的行为将被视为已经仔细阅读、充分理解并毫无保留地接受本协议所有条款。
                  </p>
                  <p className="mb-4">
                    您使用知乎 2025 年度报告应同时遵守《知乎协议》《知乎社区规范》等知乎平台规则。
                  </p>
                  <p className="mb-6">
                    您理解并确认，如您为未满十四周岁的未成年人，您将无法使用本服务。
                  </p>

                  {/* Section 1 */}
                  <h3 className="text-base font-semibold text-[#191b1f] mb-3 mt-6">1. 制作年度报告</h3>
                  <p className="mb-3">
                    知乎 2025 年度报告将根据您在知乎平台（包括不限于知乎网站， PC、平板、手机、电视、机顶盒、穿戴设备、车内平板设备等全部终端客户端产品）的历史信息，帮助您生成专属年度报告。为此，知乎需要您授权我们使用您在知乎平台中的信息（含个人信息，具体以您在使用过程中实际产生的信息为准），主要包括：
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>您的账号信息：昵称、头像、注册日期、注册天数、账号等级、性别等；</li>
                    <li>创作记录：发布内容（问题、回答、评论、文章、想法等）及其日期、数量、时间点（时间段）、所属领域、浏览/收藏/赞同/分享数据等；</li>
                    <li>激励：您公开获得的平台各类荣誉称号、活动奖项（如编辑推荐、知乎热榜、知势榜、商业影响力榜）等；</li>
                    <li>粉丝：包括关注您的用户数量、具体用户、点赞互动等公开信息；</li>
                    <li>浏览记录：您浏览的内容及其日期、数量、时间点（时间段）、所属领域等；</li>
                    <li>互动数据：您的赞同、喜欢、浏览等互动数据；</li>
                    <li>圈子数据：您加入/主理的圈子、圈内浏览、讨论、赞同数据；圈内互动用户等；</li>
                    <li>付费服务使用记录：您的各类知乎会员服务购买、使用记录（包括您阅读的内容数量）等；</li>
                  </ul>
                  <p className="mb-4">
                    您理解并同意，上述信息是知乎生成年度报告的必备信息，如您拒绝授权使用，知乎将无法为您制作并提供专属年度报告。未经您的书面同意，我们保证不以超越本协议约定范围使用您的个人信息。
                  </p>

                  {/* Section 2 */}
                  <h3 className="text-base font-semibold text-[#191b1f] mb-3 mt-6">2. 使用年度报告</h3>
                  <p className="mb-4">
                    知乎提供的年度报告仅限您个人使用，您可自行留存欣赏或无偿分享、公开年度报告。您理解并同意，如因您分享、公开年度报告而产生的任何损失（包括但不限于个人信息泄露等）应由您自行承担，请您在分享、公开年度报告前审慎考虑。
                  </p>

                  {/* Section 3 */}
                  <h3 className="text-base font-semibold text-[#191b1f] mb-3 mt-6">3. 其他奖励/权益的领取、使用</h3>
                  <p className="mb-4">
                    您可依据年度报告页面提示的条件及规则领取「我的 2025 徽章」等奖励/权益，奖励/权益及其领取、使用等具体规则请以页面相关说明为准。
                  </p>

                  {/* Section 4 */}
                  <h3 className="text-base font-semibold text-[#191b1f] mb-3 mt-6">4. 知识产权及授权许可</h3>
                  <p className="mb-3">
                    年度报告及其内容（包括但不限于软件技术、程序、网页、文字、图片、音频视频、页面设计、商标等）的知识产权由知乎享有；此外，您的年度报告中可能包含其他知乎用户上传、发布的内容，上述内容的知识产权等权利由实际权利人享有。
                  </p>
                  <p className="mb-3">
                    您理解并同意，您不得超越本协议目的使用年度报告和/或年度报告中的内容素材，如您希望以任何形式将年度报告和/或年度报告中的内容素材用于本协议约定范围之外，应当经过所有实际权利人的书面许可。
                  </p>
                  <p className="mb-3">
                    您同意许可知乎及知乎用户通过使用、复制、改编、剪辑、翻译、汇编等方式对您发布的年度报告和/或年度报告中的内容素材进行二次创作，并许可前述二次创作内容在知乎平台中进行展示及传播。
                  </p>
                  <p className="mb-3">
                    您同意许可知乎使用您发布的年度报告和/或年度报告中的内容素材用于宣传及推广等用途。
                  </p>
                  <p className="mb-3">
                    上述授权性质为全球范围内、非独家、永久、可撤销的授权，且可在知乎及其关联方之间转授权。
                  </p>
                  <p className="mb-4">
                    您确认并同意，您撤销本协议项下授权或修改、删除您发布过的年度报告等行为均不影响已发布二次创作内容的继续传播。
                  </p>

                  {/* Section 5 */}
                  <h3 className="text-base font-semibold text-[#191b1f] mb-3 mt-6">5. 隐私政策</h3>
                  <p className="mb-4">
                    您理解并同意，知乎将按照《知乎个人信息保护指引》的约定处理和保护您的个人信息。
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsAgreementDialogOpen(false);
                    setIsAgreed(false);
                  }}
                  className="flex-1 h-[44px] rounded-full bg-[#F2F2F2] text-[#373a40] text-[15px] font-medium active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setIsAgreed(true);
                    setIsAgreementDialogOpen(false);
                  }}
                  className="flex-1 h-[44px] rounded-full bg-[#0084ff] text-white text-[15px] font-medium active:scale-95 transition-transform shadow-md"
                >
                  同意
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseScene>
  );
}

