"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LiuKanShanBianLiDian from "../ui/LiuKanShanBianLiDian";
import { useAssets } from '@/context/assets-context';
import { useRouter } from 'next/navigation';
import { getCampaignInfo, CampaignResponse, TaskItem, RewardItem, preOccupyReward, cancelOccupyReward } from '@/api/campaign';
import { ACTIVITY_ID, SHOW_TASK_IDS, PRIZE_POSITIONS, RECORD_BTN_POSITION } from '@/constants/campaign';
import { useToast } from '@/context/toast-context';

const TaskSection = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const { assets } = useAssets();

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
  const singlePrizeBgAsset = assets.tasks.prizeBg;

  const body = campaignData?.body;
  const head = campaignData?.head;
  const rewardsList = body?.rewards?.rewards_list || [];
  const rewardPoolId = body?.rewards?.reward_pool_id;
  const ruleContent = head?.info || '';
  const rawGroups = body?.task || [];

  const displayGroups = rawGroups.map(group => {
    const filteredTasks = group.task_list.filter(task => SHOW_TASK_IDS.includes(task.id));
    return {
      ...group,
      task_list: filteredTasks
    };
  }).filter(group => group.task_list.length > 0);

  const handleTaskAction = (task: TaskItem) => {
    const { state } = task;
    if (state.point_received) return;

    if (state.point_can_receive) {
      console.log(`触发领取积分接口: 任务ID ${task.id}`);
    }

    let targetUrl = state.app_url;

    if (targetUrl) {
      try {
        targetUrl = decodeURIComponent(targetUrl).trim();
      } catch {
        targetUrl = targetUrl.trim();
      }
    }

    const isValidUrl = targetUrl &&
      targetUrl.trim() !== '' &&
      targetUrl !== '%20' &&
      targetUrl !== 'undefined';
    console.log('isValidUrl', isValidUrl, targetUrl)
    if (isValidUrl && targetUrl) {
      console.log(`跳转到: ${targetUrl}`);
      window.location.href = targetUrl;
    } else {
      console.log('该任务暂时没有配置跳转链接');
    }
  };

  // 兑换 - 先调用预占接口
  const handleRedeemClick = async (reward: RewardItem) => {
    if (!rewardPoolId) {
      showToast('活动信息加载中，请稍后再试', 'error');
      return;
    }

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
    const url = `https://www.zhihu.com/parker/campaign/point-redeem/${ACTIVITY_ID}?zh_nav_left=back&zh_forcehybrid=1`;
    window.location.href = url;
  };

  // 跳转到积分明细
  const handleGoToPointDetails = () => {
    const url = `https://www.zhihu.com/parker/campaign/point-redeem/${ACTIVITY_ID}?zh_nav_left=back&zh_forcehybrid=1&type=taskPoints`;
    window.location.href = url;
  };

  // todo 仅仅是为了展示，具体button逻辑不一定是下面的
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
    return (
      <div className={`min-w-[70px] h-[28px] leading-[28px] text-center rounded-[14px] text-xs font-medium ${btnText ? 'bg-blue' : 'bg-[#bcd7ff]'} text-white shadow-md active:scale-95 transition-transform cursor-pointer`}
        onClick={() => handleTaskAction(task)}>
        {btnText || '未开始'}
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

            <div 
              className="text-xs text-gray cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity"
              onClick={handleGoToPointDetails}
            >
              积分明细
            </div>
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
            {rewardsList.map((item, index) => {
              const positionStyle = PRIZE_POSITIONS[index];
              if (!positionStyle) return null;

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
                    top: positionStyle.top,
                    left: positionStyle.left,
                    width: positionStyle.width,
                    height: positionStyle.height,
                  }}
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={singlePrizeBgAsset.url}
                      alt="bg"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div
                    className="absolute top-[0] left-1/2 -translate-x-1/2 w-[90%] px-3 py-2 flex items-center justify-center z-30  shadow-sm"
                    style={{
                      background: '#DCF897',
                      clipPath: 'polygon(86% 14%, 97% 7%, 100% 82%, 94% 89%, 62% 82%, 25% 90%, 6% 88%, 7% 58%, 6% 17%, 58% 5%)',
                      filter: 'drop-shadow(0px 3px 0px #0072ff)',
                    }}
                  >
                    <span className="text-[#121212] text-[10px] font-bold leading-tight text-center px-1 break-all">
                      {item.right_name}
                    </span>
                  </div>
                  <div className="relative w-full h-full scale-90">
                    <Image
                      src={item.url}
                      alt={item.right_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute bottom-[8px] left-[4px] z-30 flex items-end">
                    <span className="text-[#121212] font-bold text-base leading-none mr-[1px]">×</span>
                    <span className="text-[#121212] font-bold text-[16px] leading-none">
                      {item.right_total_stock}
                    </span>
                  </div>

                  <div
                    className="absolute -bottom-[3%] -right-[5%] bg-white z-30 px-1 py-[2px] flex items-center shadow-sm"
                  >
                    <span className="text-[#2079fe] font-bold text-xs pixel-font">
                      {item.right_point} {item.right_point_name}
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
                          <span className="text-xs text-red-500">【ID:{task.id}】</span>
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