"use client";

export interface P2Data {
  questionCount: number;
  answerCount: number;
  topicCount: number;
  topTopic: string;
}

interface P2Props {
  onNext?: () => void;
  data: P2Data;
}

export default function P1Scene({ onNext, data }: P2Props) {
  const {
    questionCount = 0,
    answerCount = 0,
    topicCount = 0,
    topTopic = ''
  } = data || {};
  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
      onClick={onNext}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px]">
          <div className="text-[22px] leading-relaxed">
            这一年，你依旧好奇
          </div>
          <div className="pt-[60px] pb-[14px]">
            你向世界发出 <span className="text-r-pink font-bold text-[18px] px-[5px]">{questionCount}</span> 提问
          </div>

          <div className="flex items-start">
            <span className="text-[24px] text-r-fern font-bold pr-[5px]">{answerCount}</span>
            <span className="mt-2">条回答和评论让这些好奇有了回声</span>
          </div>

          <div className="text-sm  pt-[33px]">
            <p className='pb-[12px]'>你的好奇伸向 <span className="text-r-blue font-bold text-[18px] px-[5px]">{topicCount}</span> 个领域</p>
            <p className="flex items-center">
              其中，<span className="text-r-green text-[18px] font-bold pr-[5px]">{topTopic}</span> 领域让你反复追问
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}