"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LiuKanShanBianLiDian from "../ui/LiuKanShanBianLiDian";
import { useAssets } from '@/context/assets-context';
import { useRouter } from 'next/navigation';
import { getCampaignInfo, CampaignResponse, TaskItem, RewardItem, preOccupyReward, cancelOccupyReward } from '@/api/campaign';
import { ACTIVITY_ID, SHOW_TASK_IDS, PRIZE_MAP, RECORD_BTN_POSITION, COMPLETE_TASK_IDS } from '@/constants/campaign';
import { useToast } from '@/context/toast-context';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';

const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return '--/--/--';
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}/${month}/${day}`;
};

const TaskSection = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const isZhihuApp = useZhihuApp();
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const { assets } = useAssets();
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (moduleInView) {
      // 埋点20
      trackShow({ moduleId: 'liukanshan_points_store_2025', type: 'Block' });
    }
  }, [moduleInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCampaignInfo(ACTIVITY_ID);
        setCampaignData(data);
      } catch (error) {
        console.error("Failed to fetch campaign data:", error);
      }
    };

    fetchData();
  }, []);

  if (!assets) return null;

  const bgAsset = assets.tasks.bg;
  const prizeAssets = assets.tasks.prizes;
  const iconXAsset = assets.tasks.prizex;

  const activity_data = campaignData?.activity_data;
  const body = campaignData?.body;
  const head = campaignData?.head;
  const currentPoint = activity_data?.running?.current_point;
  const rewardsList = body?.rewards?.rewards_list || [];
  const rewardPoolId = body?.rewards?.reward_pool_id;
  const ruleContent = head?.info || '';
  const rawGroups = body?.task || [];
  const endTime = activity_data?.end_time;
  const formatEndTime = formatDate(Number(endTime || 0) + 1);

  const displayGroups = rawGroups.map(group => {
    const filteredTasks = group.task_list.filter(task => SHOW_TASK_IDS.includes(task.id));
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
    handleSpecificTask(task.id, task);
  };

    // 统一的任务特定处理函数
    const handleSpecificTask = (taskId: number, task: TaskItem) => {
      switch (taskId) {
        case COMPLETE_TASK_IDS.BROWSE_FENHUICHANG: {
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
        case COMPLETE_TASK_IDS.BROWSE_ZHEXIEZHENDEKEYI: {
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
        case COMPLETE_TASK_IDS.BROWSE_LKS_SECTION: {
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

  // 兑换 - 先调用预占接口
  const handleRedeemClick = async (reward: RewardItem) => {
    if (!rewardPoolId) {
      showToast('活动信息加载中，请稍后再试', 'error');
      return;
    }
    //埋点23
    trackEvent('', {
      moduleId: 'rewards_product_2025',
      type: 'Button'
    }, {
      config_map: {
        sku_id: String(reward.right_id)
      }
    });

    // 生成请求ID（毫秒级时间戳）
    const newRequestId = Date.now();

    try {
      // 调用预占接口
      await preOccupyReward(ACTIVITY_ID, {
        request_id: newRequestId,
        reward_pool_id: rewardPoolId,
        reward_right_id: reward.right_id,
        reward_right_type: 'SUPER_LIKE', // 根据API文档示例，可能需要从接口返回
      });

      // 预占成功，保存信息并显示弹窗
      setRequestId(newRequestId);
      setSelectedReward(reward);
      setIsRedeemModalOpen(true);
      console.log(`预占成功: ${reward.right_id} ${reward.right_name}`);
    } catch (error) {
      // 预占失败，显示错误信息
      const errorMessage = (error as { msg?: string; message?: string })?.msg ||
        (error as { msg?: string; message?: string })?.message ||
        '兑换失败，请稍后重试';
      showToast(errorMessage, 'error');
      console.error('预占失败:', error);
    }
  };

  // 取消兑换 - 调用取消预占接口
  const handleCancelRedeem = async () => {
    if (!selectedReward || !requestId || !rewardPoolId) {
      setIsRedeemModalOpen(false);
      setSelectedReward(null);
      setRequestId(null);
      return;
    }

    try {
      await cancelOccupyReward(ACTIVITY_ID, {
        request_id: requestId,
        reward_pool_id: rewardPoolId,
        reward_right_id: selectedReward.right_id,
        reward_right_type: 'SUPER_LIKE',
      });
      console.log('取消预占成功');
    } catch (error) {
      console.error('取消预占失败:', error);
      // 即使取消失败，也关闭弹窗
    } finally {
      setIsRedeemModalOpen(false);
      setSelectedReward(null);
      setRequestId(null);
    }
  };

  // 确认兑换 - 跳转到地址表单
  const confirmRedeem = () => {
    if (!selectedReward || !requestId || !rewardPoolId) return;

    setIsRedeemModalOpen(false);
    // 传递必要的参数到地址表单
    router.push(
      `/?requireAddress=true&rewardId=${selectedReward.right_id}&rewardPoolId=${rewardPoolId}&requestId=${requestId}&from=redeem`
    );
  };

  // 跳转到兑换记录
  const handleGoToRecords = () => {
    //埋点22
    trackEvent('', {
      moduleId: 'rewards_redemption_history_2025',
      type: 'Button'
    });
    const url = `https://www.zhihu.com/parker/campaign/point-redeem/${ACTIVITY_ID}?zh_nav_left=back&zh_forcehybrid=1`;
    window.location.href = url;
  };

  // 跳转到积分明细
  const handleGoToPointDetails = () => {
    //埋点21
    trackEvent('', {
      moduleId: 'points_details_button_2025',
      type: 'Button'
    });
    const url = `https://www.zhihu.com/parker/campaign/point-redeem/${ACTIVITY_ID}?type=taskPoints`;
    window.location.href = url;
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
      <div className='flex justify-center pb-9 px-[54px]'>
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

            <div
              className="text-xs text-gray cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity"
              onClick={handleGoToPointDetails}
            >
              积分明细
            </div>
          </div>

          <div className="bg-white rounded-[8px] flex flex-col items-center justify-center min-h-[45px]">
            {currentPoint !== undefined ? (
              <>
                <div className="text-xl font-black text-blue-500">{currentPoint}</div>
                <div className="text-xs text-gray-400">将于 {formatEndTime} 过期</div>
              </>
            ) : (
              <span className="text-gray-400 text-sm">活动未开始</span>
            )}
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
            {PRIZE_MAP.map((config, index) => {
              let item = rewardsList.find(r => r.right_id === config.targetId);
              const prizeImg = prizeAssets[index]; // 获取对应的奖品图片资源

              if (!config.style || !prizeImg) return null;
              if (!item) {
                item = rewardsList[index];
              };

              if (!config || !item || !prizeImg) return null;

              const isSoldOut = item.state.code === '2';

              return (
                <div
                  key={item.right_id || index}
                  onClick={() => !isSoldOut && handleRedeemClick(item)}
                  className={`absolute z-20 transition-transform ${isSoldOut
                    ? 'cursor-default'
                    : 'cursor-pointer'
                    }`}
                  style={{
                    top: config.style.top,
                    left: config.style.left,
                    width: config.style.width,
                    height: config.style.height,
                  }}
                >
                  <Image
                    src={prizeImg.url}
                    alt={prizeImg.alt}
                    fill
                    className="object-contain"
                  />
                  <div className="absolute bottom-[12px] left-[7px] z-30 flex items-center">
                    <div className="relative w-[9px] h-[9px] mr-[2px]">
                      <Image
                        src={iconXAsset.url}
                        alt={iconXAsset.alt}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[#121212] font-bold text-base leading-none">
                      {item.right_total_stock}
                    </span>
                  </div>

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
        {
          displayGroups.map((group, index) => (
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
                          <span className="ml-2 font-normal">({task.finished}/{task.total})</span>
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
          ))
        }


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

      {isRedeemModalOpen && selectedReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-8 animate-overlayShow">
          <div className="bg-white w-[300px] rounded-[16px] overflow-hidden flex flex-col items-center pt-6 pb-6 px-5 animate-contentShow relative">
            <div className="text-[16px] font-bold text-black text-center leading-tight mb-4">
              使用
              <span className="font-black mx-1">{selectedReward.right_point}</span>
              {selectedReward.right_point_name}
              <br />
              兑换 「 <span className="text-blue">{selectedReward.right_name}</span> 」
            </div>
            <div
              className="text-[13px] text-gray w-full leading-relaxed mb-6 max-h-[200px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: selectedReward.right_desc || '' }}
            />
            <div className="flex justify-between w-full gap-4">
              <button
                onClick={handleCancelRedeem}
                className="flex-1 h-[40px] rounded-full bg-[#F2F2F2] text-gray text-[15px] font-medium active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 h-[40px] rounded-full bg-blue text-white text-[15px] font-medium active:scale-95 transition-transform shadow-md"
              >
                确定
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TaskSection;