"use client";
import Image from "next/image";
import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import { useAssets } from '@/context/assets-context';
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P2Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const green1Asset = bgAsset.green1;
  const mix1Asset = bgAsset.mix1;
  const mix2Asset = bgAsset.mix2;

  const p2Assets = assets.report.p2;
  const liukanshanAsset = p2Assets.liukanshan;
  const blueBallAsset = p2Assets.blueBall;
  const yellowBallAsset = p2Assets.yellowBall;
  
  // Map context data to component variables according to P2 spec
  const questionCount = reportData?.publish_question_cnt ?? null;
  const answerCount = reportData?.question_answer_comment_cnt ?? null;
  const domainCount = reportData?.publish_domain_cnt ?? null;
  const topDomain = reportData?.publish_domain_name ?? null;
  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName} contentClassName="pl-[34px]">
      <div className="z-0">
        {/* 标题右侧蓝色小块 */}
        <Image src={blue1Asset.url} alt="{blue1Asset.alt}" width={blue1Asset.width} height={blue1Asset.height} 
          className="object-contain absolute -top-[100px] right-[36px] pointer-events-none select-none z-0" />
        {/* 标题左侧粉色/绿色小块 */}
        <Image src={mix2Asset.url} alt="{mix2Asset.alt}" width={mix2Asset.width} height={mix2Asset.height} 
          className="object-contain absolute top-[31px] left-[0px] pointer-events-none select-none z-0" />
        {/* 中间左侧蓝色马赛克*/}
        <Image src={blue2Asset.url} alt="{blue2Asset.alt}" width={blue2Asset.width} height={blue2Asset.height} 
          className="object-contain absolute bottom-[231px] left-[26px] pointer-events-none select-none z-0" />
        {/* 左下角绿色故障树 */}
        <Image src={green1Asset.url} alt="{green1Asset.alt}" width={green1Asset.width} height={green1Asset.height} 
          className="object-contain absolute bottom-[0%] left-[0px] pointer-events-none select-none z-0" />
        {/* 右下角红绿长条 */}
        <Image src={mix1Asset.url} alt="{mix1Asset.alt}" width={mix1Asset.width} height={mix1Asset.height} 
          className="object-contain absolute bottom-[0%] right-[0px] pointer-events-none select-none z-0" />
      </div>
      <div className="z-0">
        <Image 
          src={blueBallAsset.url} 
          alt={blueBallAsset.alt} 
          width={blueBallAsset.width} 
          height={blueBallAsset.height} 
          className="object-contain absolute bottom-[212px] right-[74px] pointer-events-none select-none z-0" 
        />
        <Image 
          src={liukanshanAsset.url} 
          alt={liukanshanAsset.alt} 
          width={liukanshanAsset.width} 
          height={liukanshanAsset.height} 
          className="object-contain absolute bottom-[40px] right-[55px]  pointer-events-none select-none z-0" 
        />
      </div>
     
      <div className={typographyClass('title') + ' leading-relaxed'}>
        这一年，你依旧好奇
      </div>
      <div className="pt-[60px] pb-[14px]">
        你向世界发出 <span className={`${colorClass('pink', 'font-bold')} ${typographyClass('subtitle')} px-[5px]`}>{questionCount ?? 'publish_question_cnt'}</span> 次提问
      </div>

      <div className="">
        <span className={`${typographyClass('highlight')} ${colorClass('fern')} font-bold pr-[5px]`}>{answerCount ?? 'question_answer_comment_cnt'}</span>
        <p className="mt-2">条回答和评论让这些好奇有了回声</p>
      </div>

      <div className="relative pt-[43px]">
        <p className='pb-[12px]'>你的好奇伸向 <span className={`${colorClass('blue', 'font-bold')} ${typographyClass('subtitle')} px-[5px]`}>{String(domainCount ?? 'publish_domain_cnt')}</span> 个领域</p>
        <p className="flex items-center">
          其中，<span className={`${colorClass('green')} ${typographyClass('subtitle')} font-bold pr-[5px]`}>{String(topDomain ?? 'publish_domain_name')}</span> 领域让你反复追问
        </p>
      </div>
    </BaseScene>
  );
}