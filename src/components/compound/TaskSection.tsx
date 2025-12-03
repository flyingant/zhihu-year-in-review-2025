"use client";

import React, { useState, useEffect } from 'react';
import { useAssets } from '@/context/assets-context';
import { getCampaignInfo, CampaignResponse, TaskItem } from '@/api/campaign';
import { useToast } from '@/context/toast-context';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';
import { useMobile } from '@/hooks/useMobile';

const TaskSection = () => {
  const { showToast } = useToast();
  const isZhihuApp = useZhihuApp();
  const { assets } = useAssets();
  const isMobile = useMobile();
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (moduleInView) {
      // 埋点20
      trackShow({ moduleId: 'liukanshan_points_store_2025', type: 'Block' });
    }
  }, [moduleInView, trackShow]);

  useEffect(() => {
    if (!assets?.campaign) return;
    
    const fetchData = async () => {
      try {
        const data = await getCampaignInfo(assets.campaign.activityId);
        setCampaignData(data);
      } catch (error) {
        console.error("Failed to fetch campaign data:", error);
      }
    };

    fetchData();
  }, [assets]);

  if (!assets) return null;

  const body = campaignData?.body;
  const rawGroups = body?.task || [];

  const displayGroups = rawGroups.map(group => {
    const filteredTasks = group.task_list.filter(task => assets.campaign.showTaskIds.includes(task.id));
    return {
      ...group,
      task_list: filteredTasks
    };
  }).filter(group => group.task_list.length > 0);

  // 获取并清理URL
  const getCleanUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
      let cleaned = decodeURIComponent(url).trim();
      // 移除首尾的%20和空格
      cleaned = cleaned.replace(/^%20+|%20+$/g, '').trim();
      if (cleaned && cleaned !== 'undefined' && cleaned !== ' ') {
        return cleaned;
      }
    } catch {
      const trimmed = url.trim().replace(/^%20+|%20+$/g, '').trim();
      if (trimmed && trimmed !== 'undefined' && trimmed !== ' ') {
        return trimmed;
      }
    }
    return null;
  };

  const handleTaskAction = (task: TaskItem) => {
    const { state } = task;
    if (state.point_received) return;
    //埋点24
    trackEvent('', {
      moduleId: 'task_module_2025',
      type: 'Button'
    }, {
      config_map: {
        task_id: String(task.id)
      }
    });

    if (state.point_can_receive) {
      console.log(`触发领取积分接口: 任务ID ${task.id}`);
    }

    // 使用app_url（知乎App内）或pc_url（浏览器）
    let targetUrl: string | null = null;

    if (isZhihuApp) {
      targetUrl = getCleanUrl(state.app_url);
    } else {
      targetUrl = getCleanUrl(state.pc_url);
    }

    // 如果有有效URL，直接跳转
    if (targetUrl) {
      console.log(`跳转到: ${targetUrl}`);
      window.location.href = targetUrl;
      return;
    }

    // 如果没有有效URL，根据任务ID使用特定的处理函数
    handleSpecificTask(task.id);
  };

    // 统一的任务特定处理函数
    const handleSpecificTask = (taskId: number) => {
      switch (taskId) {
        case assets.campaign.completeTaskIds.BROWSE_FENHUICHANG: {
          // 滚动到 "在知乎连接真实" 部分
          const targetSection = document.getElementById('zaizhihu-lianjie-zhenshi-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('未找到目标区域: zaizhihu-lianjie-zhenshi-section');
            showToast('页面加载中，请稍后再试', 'info');
          }
          break;
        }
        case assets.campaign.completeTaskIds.BROWSE_ZHEXIEZHENDEKEYI: {
          // 滚动到 "这些真的可以" 部分
          const targetSection = document.getElementById('zhexie-zhende-keyi-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('未找到目标区域: zhexie-zhende-keyi-section');
            showToast('页面加载中，请稍后再试', 'info');
          }
          break;
        }
        case assets.campaign.completeTaskIds.BROWSE_LKS_SECTION: {
          // 触发 SidebarLiuKanshan 的动画效果
          const animateEvent = new CustomEvent('liukanshan-animate');
          window.dispatchEvent(animateEvent);
          break;
        }
        default:
          console.log(`未处理的任务ID: ${taskId}`);
          showToast(`任务 ${taskId} 的处理逻辑待实现`, 'info');
      }
    };

  // 处理非App内用户点击任务区域 - 跳转到App内URL
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Overlay clicked, URL:', assets?.urls?.liukanshanPointTaskInAppRedirectionURL);
    if (assets?.urls?.liukanshanPointTaskInAppRedirectionURL) {
      window.location.href = assets.urls.liukanshanPointTaskInAppRedirectionURL;
    } else {
      console.warn('liukanshanPointTaskInAppRedirectionURL is not available');
    }
  };

  const renderTaskButton = (task: TaskItem) => {
    const isReceived = task.state.point_received;
    const btnText = task.state.desc;

    if (isReceived) {
      return (
        <div className="min-w-[70px] h-[28px] leading-[28px] text-center rounded-[14px] text-xs font-medium bg-[#bcd7ff] text-gray-400">
          已完成
        </div>
      );
    }

    // 按钮样式：统一使用蓝色，无论是否有URL都可点击
    const buttonClass = `${btnText ? 'bg-blue' : 'bg-[#bcd7ff]'} text-white shadow-md active:scale-95 transition-transform cursor-pointer`;

    return (
      <div
        className={`min-w-[70px] h-[28px] leading-[28px] text-center rounded-[14px] text-xs font-medium ${buttonClass}`}
        onClick={() => handleTaskAction(task)}
      >
        {btnText || '未开始'}
      </div>
    );
  };

  return (
    <div ref={moduleRef} className="relative w-full pb-10 flex flex-col pt-1">
      <div 
        className="relative mx-[16px]"
        style={{ pointerEvents: (!isZhihuApp && isMobile) ? 'none' : 'auto' }}
      >
      {/* 非App内用户透明遮罩层 */}
      {!isZhihuApp && isMobile && (
        <div
          onClick={handleOverlayClick}
          onMouseDown={handleOverlayClick}
          className="absolute inset-0 z-60 cursor-pointer"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.01)',
            pointerEvents: 'auto',
            minHeight: '100%'
          }}
        />
      )}
        {/* 3. 任务列表 */}
        <div className="min-h-[100px]">
        {
          displayGroups.length > 0 ? displayGroups.map((group, index) => (
            <div key={index} className="bg-[#e1f4ff] rounded-[12px] pt-3 px-4 pb-5 mb-4">
              <div className="mb-3">
                <div className="text-base font-bold text-black">{group.title}</div>
                <div className="text-xs text-gray">{group.desc}</div>
              </div>

              <div className="flex flex-col gap-3">
                {group.task_list.map((task) => (
                  <div key={task.id} className="bg-white rounded-[10px] p-3 flex items-center justify-between shadow-sm">
                    <div className="flex flex-col flex-1 pr-2">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-bold text-black">
                          {/* <span className="text-xs text-red-500">【ID:{task.id}】</span> */}
                          {task.name}
                          <span className="ml-2 font-normal">
                            {(task.task_type === 'OtherTASK')
                              ? (task.state.point_received ? '(1/1)' : '(0/1)')
                              : `(${task.finished}/${task.total})`
                            }
                          </span>
                        </span>
                      </div>
                      <div className="text-xs text-gray">{task.desc}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 min-w-[70px]">
                      <span className="text-xs font-bold text-blue">+{task.finish_point} 积分</span>
                      {renderTaskButton(task)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="bg-[#e1f4ff] rounded-[12px] pt-3 px-4 pb-5 mb-4">
              <div className="text-sm text-gray-400 text-center">任务加载中...</div>
            </div>
          )
        }
        </div>

      </div>

    </div>
  );
};

export default TaskSection;