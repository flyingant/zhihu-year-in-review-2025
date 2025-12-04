"use client";

export interface P5Data {
  commentCount: number;
  hotCommentLikes: number;
  interactionDate: string;
  interactionUser: string;
}

interface P5Props {
  onNext?: () => void;
  data: P5Data;
}

export default function P5Scene({ onNext, data }: P5Props) {
  const {
    commentCount = 0,
    hotCommentLikes = 0,
    interactionDate = '',
    interactionUser = ''
  } = data || {};

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
      onClick={onNext}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px] pr-[34px]">
          <div className="text-[22px] mb-[60px]">
            这一年，你真心分享
          </div>

          {/* 评论统计 */}
          <div className="mb-[20px]">
            你一共发出过 <span className="text-r-green text-[18px] px-[2px]">{commentCount}</span> 条评论
          </div>

          {/* 最热评论 */}
          <div className="mb-[215px]">
            最热一条被 <span className="text-r-pink text-[24px] px-[5px]">{hotCommentLikes}</span> 人点赞和回复
          </div>

          {/* 互动日期 */}
          <div className="mb-[14px]">
            你是否还记得 <span className="text-r-yellow text-[18px] px-[2px]">{interactionDate}</span>
          </div>

          {/* 互动对象 */}
          <div className="leading-relaxed">
            曾和 <span className="text-r-fern text-[18px] px-[2px]">@{interactionUser}</span> 在评论区思维碰撞，反复交锋
          </div>

        </div>
      </div>
    </div>
  );
}