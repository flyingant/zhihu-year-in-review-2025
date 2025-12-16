'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P26Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { liukanshan, pinkPixel, rainbow, redPixel1, redPixel2 } =
    assets.report.p26;
  const { mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P26 spec (特殊-故事会员/作者)
  const writeStoryNumSum = reportData?.write_story_num_sum ?? null;
  const totalUpvoteNum = reportData?.total_upvote_num ?? null;
  const writeStoryMostPopularName =
    reportData?.write_story_most_popular_name ?? null;
  const shortStoryInfluenceList =
    reportData?.short_story_influence_list ?? null;
  const annualAuthor = reportData?.annual_author ?? null;
  const awardedCopy = reportData?.awarded_copy ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* pixel block */}
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '30px', left: '65px' }}
        />
        <Image
          src={redPixel2.url}
          alt='{redPixel2.alt}'
          width={redPixel2.width}
          height={redPixel2.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '101px', right: '14px' }}
        />
        <Image
          src={pinkPixel.url}
          alt='{pinkPixel.alt}'
          width={pinkPixel.width}
          height={pinkPixel.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '558px', left: '22px' }}
        />
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '605px', left: '25px' }}
        />
        <Image
          src={redPixel1.url}
          alt='{redPixel1.alt}'
          width={redPixel1.width}
          height={redPixel1.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '680px', left: '0' }}
        />
        <Image
          src={mix22_4.url}
          alt='{mix22_4.alt}'
          width={mix22_4.width}
          height={mix22_4.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '631px', right: '0' }}
        />
      </GlitchLayer>
      {/* images */}
      <div className='z-0'>
        <Image
          src={rainbow.url}
          alt='{rainbow.alt}'
          width={rainbow.width}
          height={rainbow.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '0', left: '0', right: '0' }}
        />
        <Image
          src={liukanshan.url}
          alt='{liukanshan.alt}'
          width={liukanshan.width}
          height={liukanshan.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '410px', left: '108px', right: '0' }}
        />
      </div>
      {/* content */}
      <div
        className='absolute z-0 leading-relaxed'
        style={{ fontSize: 14, top: '114px', left: '40px' }}
      >
        <p style={{ fontSize: 22 }}>情节之下，是心意织成的篇章</p>
        {!!writeStoryNumSum && (
          <div className='z-0'>
            <div className='mb-[8px]'>
              今年,你创作
              <span className={`text-r-pink px-[7px]`} style={{ fontSize: 24 }}>
                {String(writeStoryNumSum ?? 'write_story_num_sum')}
              </span>
              篇故事，
              <br />
              把想象的灵光化成了文字与篇章
            </div>
          </div>
        )}

        {!!totalUpvoteNum && (
          <div className='z-0 my-[20px]'>
            <div>
              有
              <span
                className={`text-r-green px-[7px]`}
                style={{ fontSize: 24 }}
              >
                {String(totalUpvoteNum ?? 'total_upvote_num')}
              </span>
              位读者喜欢你的故事
            </div>
            <div>
              其中，
              <span className={`text-r-blue pr-[4px]`} style={{ fontSize: 17 }}>
                《
                {String(
                  writeStoryMostPopularName ?? 'write_story_most_popular_name'
                )}
                》
              </span>
              最受大家的欢迎
            </div>
          </div>
        )}

        {/* 荣誉榜单 - 可滑动 */}
        <div
          className='max-h-[100px] overflow-y-auto'
          style={{ marginRight: 20 }}
        >
          <div className=''>
            {!!shortStoryInfluenceList && (
              <div>
                你的作品
                <span className={`text-r-pink px-[2px]`}>
                  《
                  {String(
                    shortStoryInfluenceList ?? 'short_story_influence_list'
                  )}
                  》
                </span>
              </div>
            )}

            {!!awardedCopy && (
              <div>
                <span>{String(awardedCopy ?? 'awarded_copy')}</span>
              </div>
            )}
            {!!annualAuthor && (
              <div>
                你荣获
                <span
                  className='text-r-blue'
                  style={{ fontSize: 18, marginLeft: 4 }}
                >
                  {String(annualAuthor ?? 'annual_author')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
