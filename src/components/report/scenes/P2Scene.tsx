"use client";

interface P2Props {
  onNext?: () => void;
}

export default function P2Scene({ onNext }: P2Props) {
  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
      onClick={onNext}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px]">
          <div className="text-[22px] leading-relaxed pt-[44px]">
            这一年，你依旧好奇
          </div>
          <div className="pt-[60px] pb-[14px]">
            你向世界发出 <span className="text-[#FF8992] font-bold text-[18px] px-[5px]">143</span> 提问
          </div>

          <div className="flex items-start">
            <span className="text-[24px] text-[#00C2A9] font-bold pr-[5px]">52</span>
            <span className="mt-2">条回答和评论让这些好奇有了回声</span>
          </div>

          <div className="text-sm  pt-[33px]">
            <p className='pb-[12px]'>你的好奇伸向 <span className="text-[#00ADE9] font-bold text-[18px] px-[5px]">4</span> 个领域</p>
            <p className="flex items-center">
              其中，<span className="text-[#4BAD39] text-[18px] font-bold pr-[5px]">科技</span> 领域让你反复追问
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}