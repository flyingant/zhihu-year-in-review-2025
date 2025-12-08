"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P26Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P26 spec (特殊-故事会员/作者)
  const writeStoryNumSum = reportData?.write_story_num_sum ?? null;
  const totalUpvoteNum = reportData?.total_upvote_num ?? null;
  const writeStoryMostPopularName = reportData?.write_story_most_popular_name ?? null;
  const shortStoryInfluenceList = reportData?.short_story_influence_list ?? null;
  const annualAuthor = reportData?.annual_author ?? null;
  const awardedCopy = reportData?.awarded_copy ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        情节之下,是心意织成的篇章
      </div>

      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          今年,你创作了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(writeStoryNumSum ?? 'write_story_num_sum')}</span> 篇故事把想象的灵光化成了情节与篇章
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          有 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(totalUpvoteNum ?? 'total_upvote_num')}</span> 位读者喜欢你的故事
        </div>
        <div>
          其中,《<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(writeStoryMostPopularName ?? 'write_story_most_popular_name')}</span>》最受大家的欢迎
        </div>
      </div>

      {/* 荣誉榜单 - 可滑动 */}
      <div className="pb-[30px] max-h-[400px] overflow-y-auto">
        <div className="space-y-[20px] text-sm">
          <div>
            <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(shortStoryInfluenceList ?? 'short_story_influence_list')}</span>
          </div>
          <div>
            <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(annualAuthor ?? 'annual_author')}</span>
          </div>
          <div>
            <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(awardedCopy ?? 'awarded_copy')}</span>
          </div>
        </div>
      </div>
    </BaseScene>
  );
}

