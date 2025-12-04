"use client";

export interface P8Data {
  zhiTrendRankCount: number | string;
  influenceRankCount: number | string;
  excellentTopicCount: number | string;
  topicName: string;
  navigatorCount: number | string;
}

interface P8Props {
  onNext?: () => void;
  data: P8Data;
}

export default function P8Scene({ onNext, data }: P8Props) {
  const {
    zhiTrendRankCount = 0,
    influenceRankCount = 0,
    excellentTopicCount = 0,
    // topicName = '数码', // 没数据时可不显示
    navigatorCount = 0
  } = data || {};

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
      onClick={onNext}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px] pr-[34px]">

          <div className="text-[24px] leading-[1.4] mb-[140px]">
            这一年，你登上知乎的荣誉殿堂
          </div>

          <div className="text-[15px] leading-[34px]">
            <div>
              <span className="text-r-blue text-[20px] pr-[4px]">{zhiTrendRankCount}</span>
              次 知势榜，
            </div>
            <div>
              <span className="text-r-fern text-[20px] pr-[4px]">{influenceRankCount}</span>
              次 知乎答主商业影响力榜
            </div>
            <div>
              成为了
              <span className="text-r-pink text-[20px] px-[4px]">{excellentTopicCount}</span>
              话题下的优秀答主
            </div>
            <div className="leading-[26px] mt-[8px]">
              你成为了航海家，用航海家赞同发现和助力了
              <span className="text-r-blue text-[20px] px-[4px]">{navigatorCount}</span>
              篇好内容
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}