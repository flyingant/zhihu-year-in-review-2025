"use client";

export interface P7Data {
  readCount: number | string;
  upvoteCount: number | string;
  collectCount: number | string;
  commentCount: number | string;
  shareCount: number | string;
  roundTableCount: number | string;
  editorPickCount: number | string;
}

interface P7Props {
  onNext?: () => void;
  data: P7Data;
}

export default function P7Scene({ onNext, data }: P7Props) {
  const {
    readCount = 0,
    upvoteCount = 0,
    collectCount = 0,
    commentCount = 0,
    shareCount = 0,
    roundTableCount = 0,
    editorPickCount = 0
  } = data || {};

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white flex pt-[120px]"
      style={{ fontFamily: 'var(--font-tianwang)' }}
      onClick={onNext}
    >
      <div className="relative w-[375px] bg-white">
        <div className="text-[14px] pl-[34px] pr-[34px]">

          <div className="text-[16px] leading-[32px] mb-[180px]">
            <div>
              你的内容一共收获了
              <span className="text-r-blue text-[20px] px-[4px]">{readCount}</span>
              次阅读
            </div>
            <div>
              <span className="text-r-fern text-[20px] pr-[4px]">{upvoteCount}</span>
              个赞同
            </div>
            <div>
              <span className="text-r-pink text-[20px] pr-[4px]">{collectCount}</span>
              次收藏
            </div>
            <div>
              <span className="text-r-blue text-[20px] pr-[4px]">{commentCount}</span>
              条评论
            </div>
            <div>
              <span className="text-r-fern text-[20px] pr-[4px]">{shareCount}</span>
              次分享
            </div>
          </div>

          <div className="text-[15px] leading-[28px]">
            <div>
              你曾在
              <span className="text-r-blue text-[20px] px-[2px]">{roundTableCount}</span>
              个圆桌中与他人探讨
            </div>
            <div>
              有
              <span className="text-r-pink text-[20px] px-[2px]">{editorPickCount}</span>
              条回答，得到了编辑推荐
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}