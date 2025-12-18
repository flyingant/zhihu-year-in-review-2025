"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAssets } from '@/context/assets-context';
import { getCampaignInfo, CampaignResponse, TaskItem } from '@/api/campaign';
import { useToast } from '@/context/toast-context';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';
import { useMobile } from '@/hooks/useMobile';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useAuth } from '@/context/auth-context';

const TaskSection = () => {
  const { showToast } = useToast();
  const isZhihuApp = useZhihuApp();
  const { assets } = useAssets();
  const isMobile = useMobile();
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (moduleInView) {
      // 埋点20
      trackShow({ moduleId: 'liukanshan_points_store_2025', type: 'Block', page: { page_id: '60850' } });
    }
  }, [moduleInView, trackShow]);

  const fetchCampaignData = useCallback(async () => {
    if (!assets?.campaign) return;
    try {
      const data = await getCampaignInfo(assets.campaign.activityId);
      setCampaignData(data);
    } catch (error) {
      console.error("Failed to fetch campaign data:", error);
      showToast("刷新失败，请稍后重试", "error");
    }
  }, [assets?.campaign, showToast]);

  useEffect(() => {
    fetchCampaignData();
  }, [fetchCampaignData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCampaignData();
    setIsRefreshing(false);
    showToast("刷新任务状态成功", "success");
    // Dispatch event to notify other components (like RewardSection) to refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('campaign-data-refresh'));
    }
  };

  if (!assets) return null;

  // Check if activity is finished
  const isActivityFinished = campaignData?.activity_data?.state === 'finished';

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

  const handleTaskAction = async (task: TaskItem) => {
    const { state } = task;
    if (state.point_received) return;
    //埋点24
    trackEvent('', {
      moduleId: 'task_module_2025',
      type: 'Button',
      page: { page_id: '60850' }
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
      // Use zhihuHybrid if in zhihu app, otherwise use window.location.href
      if (isZhihuApp && isHybridAvailable) {
        try {
          await openURL(targetUrl);
        } catch (error) {
          console.error('Failed to open URL via zhihuHybrid, falling back to window.location.href:', error);
          window.location.href = targetUrl;
        }
      } else {
        window.location.href = targetUrl;
      }
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
          showToast('请稍后再试', 'info');
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
          showToast('请稍后再试', 'info');
        }
        break;
      }
      case assets.campaign.completeTaskIds.BROWSE_LKS_SECTION: {
        // 触发 SidebarLiuKanshan 的动画效果
        const animateEvent = new CustomEvent('liukanshan-animate');
        window.dispatchEvent(animateEvent);
        break;
      }
      case assets.campaign.completeTaskIds.BROWSE_2025_YEARLY_VIDEO: {
        // 滚动到 "2025年度视频" 部分
        const targetSection = document.getElementById('2025-yearly-video-section');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('未找到目标区域: 2025年度视频');
          showToast('请稍后再试', 'info');
        }
        break;
      }
      case assets.campaign.completeTaskIds.BROWSE_2025_YEARLY_REPORT: {
        // 滚动到 "2025年度报告" 部分
        const targetSection = document.getElementById('2025-yearly-report-section');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('未找到目标区域: 2025年度报告');
          showToast('请稍后再试', 'info');
        }
        break;
      }
      case assets.campaign.completeTaskIds.BROWSE_2025_YEARLY_TEN_QUESTIONS: {
        // 滚动到 "2025年度十问" 部分
        const targetSection = document.getElementById('2025-yearly-ten-questions-section');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('未找到目标区域: 2025年度十问');
          showToast('请稍后再试', 'info');
        }
        break;
      }
      case assets.campaign.completeTaskIds.BROWSE_2025_MY_TEN_QUESTIONS: {
        // 滚动到 "我的年度十问" 部分
        const targetSection = document.getElementById('vote-ten-questions-section');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('未找到目标区域: 2025年度十问');
          showToast('请稍后再试', 'info');
        }
        break;
      }
      case assets.campaign.completeTaskIds.COLLECT_FOUR_GRID_ELEMENT: {
        // 滚动到 "收集四宫格元素" 部分
        const targetSection = document.getElementById('collect-four-grid-element-section');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('未找到目标区域: 收集四宫格元素');
          showToast('请稍后再试', 'info');
        }
        break;
      }
      default:
        console.log(`未处理的任务ID: ${taskId}`);
        showToast(`请稍后再试 ${taskId}`, 'info');
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

  // 处理未认证用户点击任务区域 - 跳转到登录页
  const handleAuthOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const signinBase = assets?.urls?.signinBase;
    login(signinBase);
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
        {/* 未认证用户透明遮罩层 */}
        {!isAuthenticated && (
          <div
            onClick={handleAuthOverlayClick}
            onMouseDown={handleAuthOverlayClick}
            className="absolute inset-0 z-70 cursor-pointer"
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
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-base font-bold text-black">{group.title}</div>
                    <div className="text-xs text-gray">{group.desc}</div>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="shrink-0 p-1.5 rounded-full hover:bg-[#d0e8ff] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="刷新"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-blue-400 ${isRefreshing ? "animate-spin" : ""}`}
                    >
                      <path
                        d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5C2 6.253 6.253 2 11.5 2c2.45 0 4.675.977 6.31 2.57M22 12.5C22 17.747 17.747 22 12.5 22c-2.45 0-4.675-.977-6.31-2.57"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

              <div className="flex flex-col gap-3" id="task-inner-section">
                {isActivityFinished ? (
                  <div className="bg-white rounded-[10px] p-3">
                    <div className="w-full text-sm text-gray-600 text-center">活动已结束</div>
                  </div>
                ) : (
                  group.task_list.map((task) => (
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
                  ))
                )}
              </div>
            </div>
          )) : (
            <div className="bg-[#e1f4ff] rounded-[12px] pt-3 px-4 pb-5 mb-4">
              <div className="text-sm text-gray-400 text-center">任务加载中...</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default TaskSection;