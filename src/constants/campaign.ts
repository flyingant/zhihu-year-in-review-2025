export const ACTIVITY_ID = 360132; // 2025 年度盛典 updated: 2025-12-01

// 需要展示的任务 ID 白名单列表，接口会返回很多任务，只有下面的需要展示
// 数组的顺序决定了页面上任务的展示顺序
export const SHOW_TASK_IDS = [
  360324,
  330349,
  330348,
  390355,
  390356,
  360326
];

export const COMPLETE_TASK_IDS = {
  BROWSE_ZHEXIEZHENDEKEYI: 330349,
  BROWSE_FENHUICHANG: 330348,
  BROWSE_LKS_SECTION: 360326,
  CLICK_LKS_GIFT: 360325,
  CLICK_LKS_GIFT_PUBLISH: 330350,
}

export const PRIZE_MAP = [
  {
    targetId: 360044,
    imgIndex: 0,
    style: { left: '5%', top: '14.7%', width: '29%', height: '23%' }
  },
  {
    targetId: 240054,
    imgIndex: 1,
    style: { left: '36%', top: '10.5%', width: '29%', height: '23%' }
  },
  {
    targetId: 300093,
    imgIndex: 2,
    style: { left: '66.5%', top: '14.5%', width: '29%', height: '23%' }
  },
  {
    targetId: 360037,
    imgIndex: 3,
    style: { left: '3%', top: '39.3%', width: '29%', height: '23%' }
  },
  {
    targetId: 330054,
    imgIndex: 4,
    style: { left: '36%', top: '37.5%', width: '29%', height: '23%' }
  },
  {
    targetId: 330055,
    imgIndex: 5,
    style: { left: '69.6%', top: '42.8%', width: '29%', height: '23%' }
  },
  {
    targetId: 330056,
    imgIndex: 6,
    style: { left: '12%', top: '62.5%', width: '29%', height: '23%' }
  },
];
export const RECORD_BTN_POSITION = {
  top: '2%',
  right: '5%',
  width: '25%',
  height: '5%'
}