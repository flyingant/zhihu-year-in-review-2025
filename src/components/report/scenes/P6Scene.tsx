"use client";

export interface P6Data {
  visitDays: number | string;
  creationDays: number | string;
  mostProductiveMonth: number | string;
  monthArticleCount: number | string;
  mostProductiveDate: string;
  dayWordCount: number | string;
  totalWords: number | string;
  equivalentBook: string;
}

interface P6Props {
  onNext?: () => void;
  data: P6Data;
}

export default function P6Scene({ onNext, data }: P6Props) {
  const {
    visitDays = 0,
    creationDays = 0,
    mostProductiveMonth = 0,
    monthArticleCount = 0,
    mostProductiveDate = '',
    dayWordCount = 0,
    totalWords = 0,
    equivalentBook = ''
  } = data || {};

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
      onClick={onNext}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px] pr-[34px]">
          <div className="text-[22px] mb-[40px]">
            <div>
              今年你一共有
              <span className="text-r-blue text-[24px] px-[4px]">{visitDays}</span>
              天来到过知乎
            </div>
            <div className="mt-[10px]">
              有
              <span className="text-r-fern text-[24px] px-[4px]">{creationDays}</span>
              天，都留下了你的创作
            </div>
          </div>

          <div className="pb-[30px]">
            <div className="mb-[6px]">
              <span className="text-r-pink text-[18px] pr-[2px]">{mostProductiveMonth}</span> 月，
              你书写了 <span className="text-r-pink text-[18px] px-[2px]">{monthArticleCount}</span> 篇内容
            </div>
            <div className="text-[#999] text-[12px]">
              是你灵感旺盛，表达最多的月份
            </div>
          </div>

          <div className="pb-[60px]">
            <div className="mb-[6px]">
              <span className="text-r-blue text-[18px] pr-[5px]">{mostProductiveDate}</span>，
              你写下 <span className="text-r-blue text-[18px] px-[2px]">{dayWordCount}</span> 字
            </div>
            <div className="text-[#999] text-[12px]">
              是你思如泉涌，妙笔生花的时间
            </div>
          </div>

          <div className="leading-[32px]">
            这一年，你在知乎一共写下
            <br />
            <span className="text-r-fern text-[24px] pr-[4px]">{totalWords}</span>
            个字
          </div>
          <div className="mt-[10px]">
            相当于写完一本《<span className="text-r-blue text-[16px]">{equivalentBook}</span>》
          </div>

        </div>
      </div>
    </div>
  );
}