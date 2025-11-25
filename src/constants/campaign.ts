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

// 奖品绝对定位配置，按照从左到右，从上到下的顺序排列，但是接口返回的顺序和设计的不一致
// 需要把这些奖品的id提前配置到PRIZE_MAP

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