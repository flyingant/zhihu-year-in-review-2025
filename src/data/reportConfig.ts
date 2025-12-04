// data/reportConfig.ts
export type SceneConfig = {
  id: string;
  component: React.ComponentType<any>;
  // 定义这个页面点击不同按钮去哪里
  next?: string | ((choice?: string) => string);
  prepareProps?: (allData: any) => Record<string, any>;
};

import LoadingScene from '@/components/report/scenes/LoadingScene';
import IntroScene from '@/components/report/scenes/IntroScene';
import SelectionScene from '@/components/report/scenes/SelectionScene';
import P2Scene from '@/components/report/scenes/P2Scene';

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
    next: (choice) => {
      if (choice === 'tech') return 'p2';
      if (choice === 'life') return 'p2';
      return 'p2';
    }
  },
  'p2': {
    id: 'p2',
    component: P2Scene,
    next: 'p3',
    prepareProps: (allData) => ({
      data: {
        questionCount: allData.questionCount || 143,
        answerCount: allData.answerCount || 52,
        topicCount: allData.topicCount || 4,
        topTopic: allData.topTopic || '科技',
      }
    })
  },
};