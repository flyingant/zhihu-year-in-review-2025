"use client";

export interface P3Data {
  answerCount: number;
  articleCount: number;
  topTopic1: string;
  topTopic2: string;
  firstAnswerDate: string;
  firstAnswerTitle: string;
}

interface P3Props {
  onNext?: () => void;
  data: P3Data;
}

export default function P3Scene({ onNext, data }: P3Props) {
  const {
    answerCount = 0,
    articleCount = 0,
    topTopic1 = '',
    topTopic2 = '',
    firstAnswerDate = '',
    firstAnswerTitle = ''
  } = data || {};

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
      onClick={onNext}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px] pr-[34px]">
          <div className="text-[22px]">
            这一年，你依旧好奇
          </div>

          <div className="pt-[60px] pb-[20px]">
            你写下了 <span className="text-r-fern text-[18px] px-[2px]">{answerCount}</span> 个回答、
            <span className="text-r-pink text-[18px] px-[2px]">{articleCount}</span> 篇文章。
          </div>
          <div className="pb-[23px]">
            给这个世界一些答案。
          </div>

          <div className="pb-[58px]">
            <span className="text-r-blue text-[18px] pr-[5px]">{topTopic1}</span>、
            <span className="text-r-blue text-[18px] px-[5px]">{topTopic2}</span>
            是你深耕最深的方向。
          </div>

          <div className="mb-[14px]">
            还记得吗？ <span className="text-r-green text-[18px] pl-[5px]">{firstAnswerDate}</span>
          </div>
          <div className="leading-[40px]">
            你在，
            <span className="text-r-fern text-[16px] mx-[4px]">
              「{firstAnswerTitle}」
            </span>
            里写下了今年第一条回答。
          </div>

        </div>
      </div>
    </div>
  );
}