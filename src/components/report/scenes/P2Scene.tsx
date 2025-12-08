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
  
  // Map context data to component variables according to P2 spec
  const questionCount = reportData?.publish_question_cnt ?? null;
  const answerCount = reportData?.question_answer_comment_cnt ?? null;
  const domainCount = reportData?.publish_domain_cnt ?? null;
  const topDomain = reportData?.publish_domain_name ?? null;
  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName} contentClassName="pl-[34px]">
      <div className="z-0">
        <div className="absolute -top-[100px] right-[36px] w-[55px] h-[74px] pointer-events-none select-none z-0">
          {/* 标题右侧蓝色小块 */}
          <Image src={blue1Asset.url} alt="{blue1Asset.alt}" fill className="w-full h-full object-contain" />
        </div>
        {/* 标题左侧粉色/绿色小块 */}
        <div className="absolute top-[31px] left-[0px] w-[44px] h-[32px] pointer-events-none select-none z-0">
          <Image src={mix2Asset.url} alt="{mix2Asset.alt}" fill className="w-full h-full object-contain" />
        </div>

        {/* 中间左侧蓝色马赛克*/}
        <div className="absolute bottom-[231px] left-[26px] w-[54px] h-[54px] pointer-events-none select-none z-0">
          <Image src={blue2Asset.url} alt="{blue2Asset.alt}" fill className="w-full h-full object-contain" />
        </div>
        {/* 左下角绿色故障树 */}
        <div className="absolute bottom-[0%] left-[0px] w-[145px] h-[107px] pointer-events-none select-none z-0">
          <Image src={green1Asset.url} alt="{green1Asset.alt}" fill className="w-full h-full object-contain" />
        </div>
        {/* 右下角红绿长条 */}
        <div className="absolute bottom-[0%] right-[0px] w-[113px] h-[55px] pointer-events-none select-none z-0">
          <Image src={mix1Asset.url} alt="{mix1Asset.alt}" fill className="w-full h-full object-contain" />
        </div>
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

      <div className="relative text-sm pt-[43px]">
        <p className='pb-[12px]'>你的好奇伸向 <span className={`${colorClass('blue', 'font-bold')} ${typographyClass('subtitle')} px-[5px]`}>{String(domainCount ?? 'publish_domain_cnt')}</span> 个领域</p>
        <p className="flex items-center">
          其中，<span className={`${colorClass('green')} ${typographyClass('subtitle')} font-bold pr-[5px]`}>{String(topDomain ?? 'publish_domain_name')}</span> 领域让你反复追问
        </p>
      </div>
    </BaseScene>
  );
}