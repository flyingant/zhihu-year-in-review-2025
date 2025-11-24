"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import LiuKanShanBianLiDian from "../ui/LiuKanShanBianLiDian";
import { mockTaskResponse } from '@/mocks/taskData';
import { assets, asset } from '@/lib/assets';


// 奖品绝对定位配置，从左到右，从上到下
const PRIZE_POSITIONS = [
  { left: '5%', top: '14.7%', width: '29%', height: '23%' },
  { left: '36%', top: '10.5%', width: '29%', height: '23%' },
  { left: '66.5%', top: '14.5%', width: '29%', height: '23%' },
  { left: '3%', top: '39.3%', width: '29%', height: '23%' },
  { left: '36%', top: '37.5%', width: '29%', height: '23%' },
  { left: '69.6%', top: '42.8%', width: '29%', height: '23%' },
  { left: '12%', top: '62.5%', width: '29%', height: '23%' },
];

const RECORD_BTN_POSITION = {
  top: '2%',
  right: '5%',
  width: '25%',
  height: '5%'
};

type TaskState = {
  code: string;
  desc?: string;
  point_received?: boolean;
  point_can_receive?: boolean;
  app_url?: string;
  pc_url?: string;
};

const TaskSection = () => {
  const { data } = mockTaskResponse;
  const { current_point } = data.activity_data?.running;
  const { rewards_list } = data.body?.rewards;
  const allTasks = data.body?.task.flatMap(group => group.task_list) || [];
  const ruleContent = data.head?.info;

  const bgAsset = asset(assets.tasks.bg) as { url: string; width: number; height: number; alt: string };
  const prizeAssets = assets.tasks.prizes.map(p => asset(p) as { url: string; width: number; height: number; alt: string });

  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // todo 兑换
  const handleRedeem = (rewardId: number) => {
    console.log(`触发兑换: ${rewardId}`);
  };

  // todo 跳转到兑换记录
  const handleGoToRecords = () => {
    console.log('跳转兑换记录');
  };

  // todo 仅仅是为了展示，具体button逻辑不一定是下面的
  const renderTaskButton = (state: TaskState) => {
    const isTaskDone = state.point_received;
    let { desc } = state;
    desc = desc?.trim();
    if (isTaskDone) {
      return (
        <div className="min-w-[70px] h-[28px] leading-[28px] text-center rounded-[14px] text-xs font-medium bg-[#bcd7ff] text-gray-400">
          已完成
        </div>
      );
    }
    return (
      <div className={`min-w-[70px] h-[28px] leading-[28px] text-center rounded-[14px] text-xs font-medium ${desc ? 'bg-[#2079fe]' : 'bg-[#bcd7ff]'} text-white shadow-md active:scale-95 transition-transform cursor-pointer`}>
        {desc || '未开始'}
      </div>
    );
  };

  return (
    <div className="relative w-full pb-10 flex flex-col pt-1">
      <div className='flex justify-center pb-9'>
        <LiuKanShanBianLiDian />
      </div>
      <div className="mx-[16px]">

        {/* 积分看板 */}
        <div className="bg-[#e1f4ff] rounded-[16px] px-4 mb-4 pt-[10px] pb-[20px]">
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-[#121212]">活动积分</span>
              <span className="text-[#999] cursor-pointer" onClick={() => setIsRulesOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
                  <path fillRule="evenodd" d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Zm0 1.5c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" clipRule="evenodd"></path>
                  <path d="M13.074 16.199a1.05 1.05 0 1 1-2.1.001 1.05 1.05 0 0 1 2.1-.001Z"></path>
                  <path fillRule="evenodd" d="M10.396 8.493c-.232.403-.246.855-.246.977a.75.75 0 1 1-1.5 0c0-.191.012-.973.448-1.728.473-.819 1.382-1.492 2.926-1.492 1.58 0 2.583.787 3.055 1.807.438.949.406 2.077.034 2.84-.212.434-.543.728-.85.942-.217.152-.471.293-.68.409l-.182.102c-.533.307-.634.46-.634.695a.75.75 0 1 1-1.5 0c0-1.145.843-1.682 1.386-1.995l.263-.148c.185-.103.338-.188.49-.294.198-.138.303-.255.36-.37.163-.335.21-.99-.049-1.551-.226-.49-.698-.937-1.693-.937-1.03 0-1.433.406-1.628.743Z" clipRule="evenodd"></path>
                </svg>
              </span>
            </div>

            <div className="text-xs text-gray">积分明细</div>
          </div>

          <div className="bg-white rounded-[8px] flex flex-col items-center justify-center min-h-[45px]">
            {/* {current_point !== undefined ? (
              <>
                <div className="text-3xl font-black text-blue-500">{current_point}</div>
                <div className="text-xs text-gray-400 mt-1">当前可用积分</div>
              </>
            ) : (
              <span className="text-gray-400 text-sm">活动未开始</span>
            )} */}
            <span className="text-gray-400 text-sm">活动未开始</span>
          </div>
        </div>

        {/* 奖品区域 */}
        <div className="relative w-full mb-4">
          <div className="relative w-full h-auto">
            <Image
              src={bgAsset.url}
              alt={bgAsset.alt}
              width={bgAsset.width}
              height={bgAsset.height}
              className="w-full h-auto object-contain"
              priority
            />
            {/* 兑换记录遮盖层 */}
            <div
              onClick={handleGoToRecords}
              className="absolute z-30 cursor-pointer active:opacity-50"
              style={{
                top: RECORD_BTN_POSITION.top,
                right: RECORD_BTN_POSITION.right,
                width: RECORD_BTN_POSITION.width,
                height: RECORD_BTN_POSITION.height,
              }}
            ></div>
            {/* 奖品列表区域 */}
            {rewards_list.map((item, index) => {
              const positionStyle = PRIZE_POSITIONS[index];
              const prizeImg = prizeAssets[index]; // 获取对应的奖品图片资源

              if (!positionStyle || !prizeImg) return null;

              const isSoldOut = item.state.code === '2';

              return (
                <div
                  key={item.right_id || index}
                  onClick={() => handleRedeem(item.right_id)}
                  className={`absolute z-20 transition-transform ${isSoldOut
                    ? 'cursor-default'
                    : 'cursor-pointer active:scale-95'
                    }`}
                  style={{
                    top: positionStyle.top,
                    left: positionStyle.left,
                    width: positionStyle.width,
                    height: positionStyle.height,
                  }}
                >
                  <Image
                    src={prizeImg.url}
                    alt={prizeImg.alt}
                    fill
                    className="object-contain"
                  />
                  {/* 这是测试接口有的字段 */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center z-30">
                      <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">已兑完</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. 任务列表 */}
        <div className="bg-[#e1f4ff] rounded-[12px] pt-3 px-4 pb-5">
          <div className="text-base font-bold text-black">今日任务</div>
          <div className="text-sm text-gray mb-3">活动未开始</div>
          <div className="flex flex-col gap-3">
            {allTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-[10px] p-3 flex items-center justify-between shadow-sm">
                <div className="flex flex-col flex-1 pr-2">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-bold text-black">
                      {task.name}
                      <span className="ml-2">({task.finished}/{task.total})</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray">{task.desc}</div>
                </div>
                <div className="flex flex-col items-center gap-1 min-w-[70px]">
                  <span className="text-xs font-bold text-[#2079fe]">+{task.finish_point} 积分</span>
                  {renderTaskButton(task.state)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 规则弹窗 */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 animate-overlayShow">
          <div className="bg-white w-[295px] rounded-[12px] overflow-hidden flex flex-col animate-contentShow">
            <div className="p-[20px]">
              <div className="text-base font-medium text-[#191b1f] text-center mb-3 pt-[10px]">活动规则</div>
              <div className="text-sm text-[#373a40] leading-relaxed max-h-[60vh] overflow-y-auto" dangerouslySetInnerHTML={{ __html: ruleContent }} />
            </div>
            <div className="px-[20px] pb-[30px]">
              <div className="w-full h-[40px] leading-[40px] text-center rounded-[20px] bg-[rgba(235,236,237,0.8)] text-[#373a40] font-medium text-sm cursor-pointer active:opacity-80" onClick={() => setIsRulesOpen(false)}>
                我知道了
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSection;