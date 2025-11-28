export const ACTIVITY_ID = 390109;

// 需要展示的任务 ID 白名单列表，接口会返回很多任务，只有下面的需要展示
// 数组的顺序决定了页面上任务的展示顺序
export const SHOW_TASK_IDS = [
  390310,
  390311,
  390312,
  300501,
  390313,
  390314,
];

export const PRIZE_POSITIONS = [
  { left: '5%', top: '14.7%', width: '29%', height: '23%' }, 
  { left: '36%', top: '10.5%', width: '29%', height: '23%' }, 
  { left: '66.5%', top: '14.5%', width: '29%', height: '23%' }, 
  { left: '3%', top: '39.3%', width: '29%', height: '23%' }, 
  { left: '36%', top: '37.5%', width: '29%', height: '23%' }, 
  { left: '69.6%', top: '42.8%', width: '29%', height: '23%' }, 
  { left: '12%', top: '62.5%', width: '29%', height: '23%' }, 
];

export const RECORD_BTN_POSITION = {
  top: '2%',
  right: '5%',
  width: '25%',
  height: '5%'
}

// 任务完成接口使用的任务 ID
// 用于 completeTask API 调用
export const TASK_IDS = {
  // 打开「分会场」页面并浏览
  BROWSE_SUB_VENUE: 390311,
  // 点击打开「年度圆桌」页面
  OPEN_ANNUAL_ROUNDTABLE: 390312,
  // 点击「刘看山送礼」
  CLICK_LKS_GIFT: 300499,
  // 点击「刘看山送礼」弹框后的「去发布」按钮
  CLICK_LKS_GIFT_PUBLISH: 300500,
} as const;