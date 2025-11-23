"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { mockTaskResponse } from '@/mocks/taskData';

type TaskState = {
  code: string;
  desc?: string;
  point_received?: boolean;
  point_can_receive?: boolean;
  app_url?: string;
  pc_url?: string;
  followList?: unknown;
};

const TaskSection = () => {
  const { data } = mockTaskResponse;
  const { current_point } = data.activity_data?.running;
  const { rewards_list } = data.body?.rewards;
  const taskGroups = data.body?.task;
  const ruleContent = data.head?.info;

  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const renderButton = (state: TaskState, type = 'task') => {
    const isTaskDone = type === 'task' && state.point_received;
    const isSoldOut = state.code === '2';

    const baseClass = "min-w-[66px] h-[24px] leading-[24px] text-center rounded-[29px] text-xs font-medium cursor-pointer px-2";

    if (isTaskDone || isSoldOut) {
      return (
        <div
          className={`${baseClass} opacity-50 text-theme-blue bg-theme-blue-light`}>
          {state.desc || '已完成'}
        </div>
      );
    }

    if (!state.desc || !state.desc?.trim()) return null;

    return (
      <div
        className={`${baseClass} text-theme-blue bg-theme-blue-light`}
      >
        {state.desc}
      </div>
    );
  };

  return (
    <div className="relative w-full pb-20 flex flex-col pt-4">
      <div className="mx-[16px]">
        {/* 积分看板 */}
        <div
          className="pt-[18px] px-[14px] pb-[10px] rounded-t-[12px] bg-card-glass">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-base font-medium text-[#121212]">活动积分</span>
              <span className="ml-1 text-[#999]" onClick={() => setIsRulesOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
                  <path fillRule="evenodd" d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Zm0 1.5c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" clipRule="evenodd"></path>
                  <path d="M13.074 16.199a1.05 1.05 0 1 1-2.1.001 1.05 1.05 0 0 1 2.1-.001Z"></path>
                  <path fillRule="evenodd" d="M10.396 8.493c-.232.403-.246.855-.246.977a.75.75 0 1 1-1.5 0c0-.191.012-.973.448-1.728.473-.819 1.382-1.492 2.926-1.492 1.58 0 2.583.787 3.055 1.807.438.949.406 2.077.034 2.84-.212.434-.543.728-.85.942-.217.152-.471.293-.68.409l-.182.102c-.533.307-.634.46-.634.695a.75.75 0 1 1-1.5 0c0-1.145.843-1.682 1.386-1.995l.263-.148c.185-.103.338-.188.49-.294.198-.138.303-.255.36-.37.163-.335.21-.99-.049-1.551-.226-.49-.698-.937-1.693-.937-1.03 0-1.433.406-1.628.743Z" clipRule="evenodd"></path>
                </svg>
              </span>
            </div>
            <div className="text-xs text-[#646464] opacity-50">积分明细</div>
          </div>
          <div className="bg-white p-[13px] rounded-[6px] mt-[10px] text-center">
            <div className="text-base font-medium text-theme-blue">
              {current_point}
            </div>
            <div className="text-[0.625rem] text-[rgba(0,0,0,0.5)] mt-[1px]">
              将于 2026/01/01 过期
            </div>
          </div>
        </div>

        {/* 兑换区域 */}
        <div
          className="px-[14px] pb-[18px] bg-card-glass">
          <div className="flex justify-between items-center">
            <div className="text-base font-medium text-[#121212]">积分兑换</div>
            <div className="text-xs text-[#646464] opacity-50">我的兑换</div>
          </div>
          <div className="flex flex-wrap mt-[10px]">
            {rewards_list.map((item, index) => (
              <div
                key={index}
                className="relative rounded-[8px] bg-white overflow-hidden cursor-pointer mb-[8px] mr-[8px]"
                style={{
                  width: 'calc((100% - 16px) / 3)',
                  marginRight: (index + 1) % 3 === 0 ? 0 : '8px'
                }}
              >
                <div className="aspect-[2/1] relative">
                  <Image
                    src={item.url}
                    alt={item.right_name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-[6px] pt-[4px]">
                  <div className="text-xs font-medium text-[#121212] truncate">
                    {item.right_name}
                  </div>
                  <div className="flex justify-between items-center mt-[2px]">
                    <div className="text-[0.625rem] text-[#999] truncate max-w-[50px]">
                      {item.right_point}积分
                    </div>
                    <div
                      className={`px-[4px] py-[2px] rounded-[12px] text-[0.625rem] font-medium min-w-[30px] text-center
                      ${item.state.code === '2'
                          ? 'text-black/50 bg-transparent'
                          : 'text-theme-blue bg-theme-blue-light'
                        }`}
                    >
                      {item.state.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 任务列表 */}
        <div
          className="px-[14px] pb-[18px] rounded-b-[12px] bg-card-glass">
          {taskGroups.map((group, gIndex) => (
            <div key={gIndex} className="mb-[18px]">
              <div className="flex-col items-center mb-[10px] pt-[10px]">
                <div className="text-base font-medium text-[#121212]">
                  {group.title}
                </div>
                <div className="text-xs text-[#646464] font-normal mt-[4px] leading-none">
                  {group.desc}
                </div>
              </div>

              <div>
                {group.task_list.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-[6px] p-[10px] mt-[10px]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-[#444] truncate w-[calc(100%-75px)]">
                        {task.name}（{task.finished}/{task.total}）
                      </div>
                      <div className="text-xs font-medium min-w-[66px] text-center text-theme-blue">
                        +{task.finish_point} <span>积分</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-[6px]">
                      <div className="text-xs text-[#999] w-[calc(100%-85px)] leading-[1.4]">
                        {task.desc}
                      </div>
                      <div>
                        {renderButton(task.state, 'task')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 弹窗组件 */}
        {isRulesOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white w-[295px] rounded-[12px] overflow-hidden flex flex-col animate-contentShow">
              <div className="p-[20px]">
                <div className="text-base font-medium text-[#191b1f] text-center mb-3 pt-[20px]">
                  活动规则
                </div>
                <div
                  className="text-sm text-[#373a40] leading-relaxed max-h-[60vh] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: ruleContent }}
                />
              </div>

              <div className="px-[20px] pb-[40px]">
                <div
                  className="w-full h-[40px] leading-[40px] text-center rounded-[20px] bg-[rgba(235,236,237,0.8)] text-[#373a40] font-medium text-sm cursor-pointer active:opacity-80"
                  onClick={() => setIsRulesOpen(false)}
                >
                  我知道了
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TaskSection;