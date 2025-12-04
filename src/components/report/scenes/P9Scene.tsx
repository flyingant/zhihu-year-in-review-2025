"use client";

interface P9Props {
  onNext?: (choice: string) => void;
}

export default function P9Scene({ onNext }: P9Props) {

  const handleChoice = (e: React.MouseEvent, choice: string) => {
    e.stopPropagation();
    if (onNext) {
      onNext(choice);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px] pr-[34px]">
          <div className="text-[32px] font-bold mb-[20px]">
            阅读，
            <br />
            正在激活你的真知
          </div>

          <div className="text-[16px] text-[#666] mb-[120px]">
            回望这一年，哪一份收获更「真」？
          </div>

          <div className="flex flex-col gap-[40px]">
            <div
              className="flex items-center cursor-pointer group"
              onClick={(e) => handleChoice(e, 'thought')}
            >
              <div className="w-[24px] h-[36px] bg-[#dbeafe] border border-blue-300 rounded-full mr-[12px] flex items-center justify-center text-[12px]">
                💎
              </div>
              <span className="text-[16px] border-b border-black pb-[2px] group-hover:text-r-blue group-hover:border-r-blue transition-colors">
                一些思考与哲理的启发
              </span>
            </div>

            <div
              className="flex items-center cursor-pointer group"
              onClick={(e) => handleChoice(e, 'knowledge')}
            >
              <div className="w-[24px] h-[36px] bg-[#fce7f3] border border-pink-300 rounded-full mr-[12px] flex items-center justify-center text-[12px]">
                💎
              </div>
              <span className="text-[16px] border-b border-black pb-[2px] group-hover:text-r-pink group-hover:border-r-pink transition-colors">
                一些知识与经验的输入
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}