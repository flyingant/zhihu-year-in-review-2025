// src/api/campaign.ts
import request from '../lib/request';

export interface ActivityData {
  running: {
    current_point: number;
    point_valid_period_desc: string;
  };
  state: string; // 'running' | 'ended' | 'not_started'
}

export interface RewardItem {
  right_id: number;
  right_name: string;
  right_point: number;
  right_point_name: string;
  right_desc: string;
  right_total_stock: number;
  url: string;
  state: {
    code: string; // '1' 可兑换, '2' 已兑完
    desc: string;
  };
}

export interface TaskState {
  code: string; // '1' 去完成, '2' 已完成/不可做
  desc?: string;
  point_received?: boolean;
  point_can_receive?: boolean;
  app_url?: string;
  pc_url?: string;
};


export interface TaskItem {
  title: string;
  id: number;
  name: string;
  desc: string;
  finish_point: number;
  total: number;
  finished: number;
  state: TaskState;
}

export interface CampaignResponse {
  activity_data: ActivityData;
  head: {
    info: string;
  };
  body: {
    rewards: {
      reward_pool_id: number;
      rewards_list: RewardItem[];
    };
    task: Array<{
      title?: string;
      desc?: string;
      task_list: TaskItem[];
    }>;
  };
}

// 获取活动详情接口
export const getCampaignInfo = (activityId: string | number) => {
  return request<CampaignResponse>({
    url: `/campaigns/user/${activityId}`,
    method: 'GET',
  });
};

// 生成「分享瞬间」海报
export interface MomentPosterResponse {
  poster_url: string;
}

export const generateMomentPoster = (momentContent: string) => {
  return request<MomentPosterResponse>({
    url: '/campaigns/v2/2025/moment_generate_poster',
    method: 'POST',
    data: {
      moment_content: momentContent,
    },
  });
};

// 「分享瞬间」一键发布想法
export const publishMomentPin = (momentContent: string, posterUrl: string) => {
  return request<null>({
    url: '/campaigns/v2/2025/publish_moment_pin',
    method: 'POST',
    data: {
      moment_content: momentContent,
      poster_url: posterUrl,
    },
  });
};

// 地址相关接口
export interface RegionData {
  abcode: string;
  name: string;
  city: Array<{
    name: string;
    code: string;
    area: Array<{
      name: string;
      code: string;
    }>;
  }>;
}

// 获取地址区域数据
export const getAddressRegions = () => {
  return request<RegionData[]>({
    url: '/campaigns/user/address',
    method: 'GET',
  });
};

// 获取已填写的地址信息
export interface AddressInfo {
  receiver: string;
  mobile: string;
  province_name: string;
  city_name: string;
  district_name: string;
  address_detail: string;
}

export const getAddressInfo = () => {
  return request<AddressInfo>({
    url: '/campaigns/v2/2025/lks_gift_address_info',
    method: 'GET',
  });
};

// 提交地址信息
export interface AddressInput {
  receiver: string;
  mobile: string;
  province_name: string;
  city_name: string;
  district_name: string;
  address_detail: string;
}

export const submitAddress = (addressData: AddressInput) => {
  return request<null>({
    url: '/campaigns/v2/2025/lks_gift_address_input',
    method: 'POST',
    data: addressData,
  });
};

// 积分兑换相关接口
export interface PreOccupyRewardParams {
  request_id: number;
  reward_pool_id: number;
  reward_right_id: number;
  reward_right_type: string;
}

// 预占奖品（点击兑换时调用）
export const preOccupyReward = (
  activityId: string | number,
  params: PreOccupyRewardParams
) => {
  return request<null>({
    url: `/campaigns/user/points/${activityId}/reward_v2/${params.reward_pool_id}/right/${params.reward_right_id}`,
    method: 'POST',
    data: {
      request_id: params.request_id,
      reward_pool_id: params.reward_pool_id,
      reward_right_id: params.reward_right_id,
      reward_right_type: params.reward_right_type,
    },
  });
};

// 取消预占
export const cancelOccupyReward = (
  activityId: string | number,
  params: PreOccupyRewardParams
) => {
  return request<{ message: string }>({
    url: `/campaigns/user/points/${activityId}/cancel_occupy`,
    method: 'POST',
    data: {
      request_id: params.request_id,
      reward_pool_id: params.reward_pool_id,
      reward_right_id: params.reward_right_id,
      reward_right_type: params.reward_right_type,
    },
  });
};

// 完成兑换（提交地址时调用）
export interface CompleteRedeemParams extends PreOccupyRewardParams {
  receive_info: {
    user_info: {
      name: string;
      mobile: string;
    };
    address: {
      province: string;
      city: string;
      district: string;
      detail: string;
    };
  };
}

export const completeRedeemReward = (
  activityId: string | number,
  params: CompleteRedeemParams
) => {
  return request<null>({
    url: `/campaigns/user/points/${activityId}/reward_v2/${params.reward_pool_id}/right/${params.reward_right_id}`,
    method: 'POST',
    data: {
      request_id: params.request_id,
      reward_pool_id: params.reward_pool_id,
      reward_right_id: params.reward_right_id,
      reward_right_type: params.reward_right_type,
      receive_info: params.receive_info,
    },
  });
};