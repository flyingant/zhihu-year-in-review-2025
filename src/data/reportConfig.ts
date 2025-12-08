import LoadingScene from '@/components/report/scenes/LoadingScene';
import IntroductionScene from '@/components/report/scenes/IntroductionScene';
import IndexScene from '@/components/report/scenes/IndexScene';
import P1Scene from '@/components/report/scenes/P1Scene';
import P2Scene from '@/components/report/scenes/P2Scene';
import P3Scene from '@/components/report/scenes/P3Scene';
import P5Scene from '@/components/report/scenes/P5Scene';
import P6Scene from '@/components/report/scenes/P6Scene';
import P7Scene from '@/components/report/scenes/P7Scene';
import P8Scene from '@/components/report/scenes/P8Scene';
import P9Scene from '@/components/report/scenes/P9Scene';

export type SceneConfig = {
  id: string;
  component: React.ComponentType<any>;
  next?: string | ((choice?: string) => string);
  prepareProps?: (allData: any) => Record<string, any>;
}

export const SCENES: Record<string, SceneConfig> = {
  'loading': {
    id: 'loading',
    component: LoadingScene,
    next: 'introduction', // Loading 完自动去 Intro
  },
  'introduction': {
    id: 'introintroduction',
    component: IntroductionScene,
    next: 'selection', // 点击开始去 Selection
  },
  'index': {
    id: 'index',
    component: IndexScene,
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
  'p3': {
    id: 'p3',
    component: P3Scene,
    next: 'p5',
    prepareProps: (allData) => ({
      data: {
        answerCount: allData.createdAnswerCount || 3,
        articleCount: allData.createdArticleCount || 3,
        topTopic1: allData.topCreatedTopic1 || '科技',
        topTopic2: allData.topCreatedTopic2 || '数码',
        firstAnswerDate: allData.firstAnswerDate || '08月12日',
        firstAnswerTitle: allData.firstAnswerTitle || '千元预算，怎么挑选适合自己的手机？'
      }
    })
  },
  'p5': {
    id: 'p5',
    component: P5Scene,
    next: 'p6',
    prepareProps: (allData) => ({
      data: {
        commentCount: allData.commentCount || 32,
        hotCommentLikes: allData.hotCommentLikes || 5114,
        interactionDate: allData.interactionDate || '03月21日',
        interactionUser: allData.interactionUser || 'aqiuqiu'
      }
    })
  },
  'p6': {
    id: 'p6',
    component: P6Scene,
    next: 'p7',
    prepareProps: (allData) => ({
      data: {
        visitDays: allData.visitDays || 365,
        creationDays: allData.creationDays || 128,
        mostProductiveMonth: allData.mostProductiveMonth || 8,
        monthArticleCount: allData.monthArticleCount || 15,
        mostProductiveDate: allData.mostProductiveDate || '11月11日',
        dayWordCount: allData.dayWordCount || 3500,
        totalWords: allData.totalWords || '158,000',
        equivalentBook: allData.equivalentBook || '三体'
      }
    })
  },
  'p7': {
    id: 'p7',
    component: P7Scene,
    next: 'p8',
    prepareProps: (allData) => ({
      data: {
        readCount: allData.readCount || '12,580',
        upvoteCount: allData.upvoteCount || 856,
        collectCount: allData.collectCount || 320,
        commentCount: allData.commentCount || 128,
        shareCount: allData.shareCount || 45,
        roundTableCount: allData.roundTableCount || 3,
        editorPickCount: allData.editorPickCount || 2
      }
    })
  },
  'p8': {
    id: 'p8',
    component: P8Scene,
    next: 'p9',
    prepareProps: (allData) => ({
      data: {
        zhiTrendRankCount: allData.zhiTrendRankCount || 5,
        influenceRankCount: allData.influenceRankCount || 2,
        excellentTopicCount: allData.excellentTopicCount || 3,
        topicName: allData.topicName || '数码',
        navigatorCount: allData.navigatorCount || 12
      }
    })
  },
  'p9': {
    id: 'p9',
    component: P9Scene,
    next: 'p10'
  }
};