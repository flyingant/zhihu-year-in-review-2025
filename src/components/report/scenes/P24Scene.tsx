"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P24Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P24 spec (特殊-影视作品)
  const movieLikeCount = reportData?.movie_like_cnt ?? null;
  
  // Top 3 movies
  const movieLikeName1 = reportData?.movie_like_name_top1 ?? null;
  const movieLikeRate1 = reportData?.movie_like_rate_top1 ?? null;
  const movieLikeUrl1 = reportData?.movie_like_url_top1 ?? null;
  
  const movieLikeName2 = reportData?.movie_like_name_top2 ?? null;
  const movieLikeRate2 = reportData?.movie_like_rate_top2 ?? null;
  const movieLikeUrl2 = reportData?.movie_like_url_top2 ?? null;
  
  const movieLikeName3 = reportData?.movie_like_name_top3 ?? null;
  const movieLikeRate3 = reportData?.movie_like_rate_top3 ?? null;
  const movieLikeUrl3 = reportData?.movie_like_url_top3 ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        漫游在文艺的海洋,哪个作品是反射你内心的那面镜子?
      </div>

      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          你参与了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(movieLikeCount ?? 'movie_like_cnt')}</span> 次作品评价
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[20px]">
          你的年度TOP3 影视作品是:
        </div>
        <div className="space-y-[15px] text-sm">
          <div>
            《<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(movieLikeName1 ?? 'movie_like_name_top1')}</span>》, <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(movieLikeRate1 ?? 'movie_like_rate_top1')}</span>% 知友推荐
            <img src={String(movieLikeUrl1 ?? 'movie_like_url_top1')} alt={String(movieLikeName1 ?? 'movie_like_name_top1')} className="mt-2 w-20 h-28 object-cover rounded" />
          </div>
          <div>
            《<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(movieLikeName2 ?? 'movie_like_name_top2')}</span>》, <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(movieLikeRate2 ?? 'movie_like_rate_top2')}</span>% 知友推荐
            <img src={String(movieLikeUrl2 ?? 'movie_like_url_top2')} alt={String(movieLikeName2 ?? 'movie_like_name_top2')} className="mt-2 w-20 h-28 object-cover rounded" />
          </div>
          <div>
            《<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(movieLikeName3 ?? 'movie_like_name_top3')}</span>》, <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(movieLikeRate3 ?? 'movie_like_rate_top3')}</span>% 知友推荐
            <img src={String(movieLikeUrl3 ?? 'movie_like_url_top3')} alt={String(movieLikeName3 ?? 'movie_like_name_top3')} className="mt-2 w-20 h-28 object-cover rounded" />
          </div>
        </div>
      </div>
    </BaseScene>
  );
}

