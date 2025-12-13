"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P11Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue10Asset = bgAsset.blue10;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  const mix8Asset = bgAsset.mix8;
  const folderAsset = assets.report.p11.folder;
  const wordsAsset = assets.report.p11.words; // This variable is defined but not used in the original JSX
  const liukanshanAsset = assets.report.p11.liukanshan;
  const tableAsset = assets.report.p11.table;
  const greenAsset = assets.report.p11.green;
  const yellowAsset = assets.report.p11.yellow;
  const crownAsset = assets.report.p11.crown;
  
  // Map context data to component variables according to P11 spec (消费-内容亮点)
  const topCategory1 = reportData?.browse_most_category_top1 ?? null;
  const topCategory2 = reportData?.browse_most_category_top2 ?? null;
  const topCategory3 = reportData?.browse_most_category_top3 ?? null;
  const categoryHours = reportData?.browse_most_category_hour ?? null;
  // const addCategoryList = reportData?.add_category_list ?? null; // Not used in JSX
  // const reduceCategoryList = reportData?.reduce_category_list ?? null; // Not used in JSX

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image 
          src={blue10Asset.url} 
          alt={blue10Asset.alt} 
          width={blue10Asset.width} 
          height={blue10Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '72px', left: '27px' }}
        />
        <Image 
          src={mix7Asset.url} 
          alt={mix7Asset.alt} 
          width={mix7Asset.width} 
          height={mix7Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '284px', right: '0px' }}
        />
        <Image 
          src={blue10Asset.url} 
          alt={blue10Asset.alt} 
          width={blue10Asset.width} 
          height={blue10Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '35px', left: '10px' }}
        />
        <Image 
          src={mix9Asset.url} 
          alt={mix9Asset.alt} 
          width={mix9Asset.width} 
          height={mix9Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '0px', right: '6px' }}
        />
      </GlitchLayer>

      <div 
        className={typographyClass('title') + ' leading-relaxed text-center'}
        style={{ paddingTop: '120px', marginBottom: '40px' }}
      >
        你浏览最多的领域是
      </div>

      {/* 浏览最多的领域 */}
      <div 
        className="flex items-center justify-center relative"
        style={{ paddingBottom: '30px' }}
      >
        <div className="absolute" style={{ marginBottom: '10px', top: '-30px' }}> {/* Adjusted position for text above folder */}
           <span 
            className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
           >
             {String(topCategory1 ?? 'browse_most_category_top1')}
           </span>
           、
           <span 
            className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
           >
             {String(topCategory2 ?? 'browse_most_category_top2')}
           </span>
           、
           <span 
            className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
           >
             {String(topCategory3 ?? 'browse_most_category_top3')}
           </span>
        </div>

        <Image 
          src={folderAsset.url} 
          alt={folderAsset.alt} 
          width={folderAsset.width} 
          height={folderAsset.height} 
          className="object-contain"
          style={{ marginBottom: '10px' }}
        />
        
        <Image 
          src={liukanshanAsset.url} 
          alt={liukanshanAsset.alt} 
          width={liukanshanAsset.width} 
          height={liukanshanAsset.height} 
          className="object-contain absolute"
          style={{ 
            top: '48%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}
        />

        <div className="text-sm text-gray-600 absolute" style={{ bottom: '0px' }}> {/* Adjusted position for text below folder */}
           {/* Note: crownAsset positioning logic was a bit unclear in original, placing it inline here */}
           <div className="flex items-center justify-center relative">
               <Image 
                 src={crownAsset.url} 
                 alt={crownAsset.alt} 
                 width={crownAsset.width} 
                 height={crownAsset.height} 
                 className="object-contain absolute"
                 style={{ top: '-25px', left: '-15px' }} // Approx adjustment
               />
               <span 
                className={`${colorClass('pink')} ${typographyClass('subtitle')}`}
                style={{ paddingLeft: '2px', paddingRight: '2px' }}
               >
                 {String(categoryHours ?? 'browse_most_category_hour')}
               </span> 
               小时
           </div>
        </div>
      </div>

      <div className="flex items-center justify-center relative" style={{ paddingBottom: '20px' }}>
        <Image 
          src={tableAsset.url} 
          alt={tableAsset.alt} 
          width={tableAsset.width} 
          height={tableAsset.height} 
          className="object-contain z-10" 
        />
        <Image 
          src={greenAsset.url} 
          alt={greenAsset.alt} 
          width={greenAsset.width} 
          height={greenAsset.height} 
          className="object-contain absolute z-10"
          style={{ left: '60px', bottom: '47px' }}
        />
        <Image 
          src={yellowAsset.url} 
          alt={yellowAsset.alt} 
          width={yellowAsset.width} 
          height={yellowAsset.height} 
          className="object-contain absolute z-10"
          style={{ top: '30px', right: '60px' }}
        />
      </div>

    </BaseScene>
  );
}