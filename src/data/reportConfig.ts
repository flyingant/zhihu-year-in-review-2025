// data/reportConfig.ts
export type SceneConfig = {
  id: string;
  component: React.ComponentType<any>;
  // 定义这个页面点击不同按钮去哪里
  next?: string | ((choice?: string) => string);
};

import LoadingScene from '@/components/report/scenes/LoadingScene';
import IntroScene from '@/components/report/scenes/IntroScene';
import SelectionScene from '@/components/report/scenes/SelectionScene';

export const SCENES: Record<string, SceneConfig> = {
  'loading': {
    id: 'loading',
    component: LoadingScene,
    next: 'intro', // Loading 完自动去 Intro
  },
  'intro': {
    id: 'intro',
    component: IntroScene,
    next: 'selection', // 点击开始去 Selection
  },
  'selection': {
    id: 'selection',
    component: SelectionScene,
    // 分支逻辑：根据用户传回的 choice 决定去哪
    next: (choice) => {
      if (choice === 'tech') return 'tech-summary';
      if (choice === 'life') return 'life-summary';
      return 'default-summary';
    }
  },
};