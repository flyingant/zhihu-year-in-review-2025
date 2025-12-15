import LoadingScene from '@/components/report/scenes/LoadingScene';
import IntroductionScene from '@/components/report/scenes/IntroductionScene';
import IndexScene from '@/components/report/scenes/IndexScene';
import P1Scene from '@/components/report/scenes/P1Scene';
import P2Scene from '@/components/report/scenes/P2Scene';
import P2BillboardScene from '@/components/report/scenes/P2BillboardScene';
import P3Scene from '@/components/report/scenes/P3Scene';
import P4Scene from '@/components/report/scenes/P4Scene';
import P5Scene from '@/components/report/scenes/P5Scene';
import P5EmojiScene from '@/components/report/scenes/P5EmojiScene';
import P6Scene from '@/components/report/scenes/P6Scene';
import P7Scene from '@/components/report/scenes/P7Scene';
import P8Scene from '@/components/report/scenes/P8Scene';
import P8CheeseScene from '@/components/report/scenes/P8CheeseScene';
import P9Scene from '@/components/report/scenes/P9Scene';
import P10Scene from '@/components/report/scenes/P10Scene';
import P11Scene from '@/components/report/scenes/P11Scene';
import P12Scene from '@/components/report/scenes/P12Scene';
import P13Scene from '@/components/report/scenes/P13Scene';
import P14Scene from '@/components/report/scenes/P14Scene';
import P15Scene from '@/components/report/scenes/P15Scene';
import P16Scene from '@/components/report/scenes/P16Scene';
import P17Scene from '@/components/report/scenes/P17Scene';
import P18Scene from '@/components/report/scenes/P18Scene';
import P19Scene from '@/components/report/scenes/P19Scene';
import P20Scene from '@/components/report/scenes/P20Scene';
import P21Scene from '@/components/report/scenes/P21Scene';
import P22Scene from '@/components/report/scenes/P22Scene';
import P23Scene from '@/components/report/scenes/P23Scene';
import P24Scene from '@/components/report/scenes/P24Scene';
import P25Scene from '@/components/report/scenes/P25Scene';
import P26Scene from '@/components/report/scenes/P26Scene';
import P27Scene from '@/components/report/scenes/P27Scene';
import P28Scene from '@/components/report/scenes/P28Scene';
import P29Scene from '@/components/report/scenes/P29Scene';
import EndingScene from '@/components/report/scenes/EndingScene';

export type SceneConfig = {
  id: string;
  component: React.ComponentType<any>;
  next?: string | ((choice?: string) => string);
  prepareProps?: (data: Record<string, unknown>) => Record<string, unknown>;
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
    next: 'index',
  },
  'index': {
    id: 'index',
    component: IndexScene,
    next: 'p1',
  },
  'p1': {
    id: 'p1',
    component: P1Scene,
    next: 'p2',
  },
  'p2': {
    id: 'p2',
    component: P2Scene,
    next: 'p2Billboard',
  },
  'p2Billboard': {
    id: 'p2Billboard',
    component: P2BillboardScene,
    next: 'p3',
  },
  'p3': {
    id: 'p3',
    component: P3Scene,
    next: 'p4',
  },
  'p4': {
    id: 'p4',
    component: P4Scene,
    next: 'p5',
  },
  'p5': {
    id: 'p5',
    component: P5Scene,
    next: 'p5Emoji',
  },
  'p5Emoji': {
    id: 'p5Emoji',
    component: P5EmojiScene,
    next: 'p6',
  },
  'p6': {
    id: 'p6',
    component: P6Scene,
    next: 'p7',
  },
  'p7': {
    id: 'p7',
    component: P7Scene,
    next: 'p8',
  },
  'p8': {
    id: 'p8',
    component: P8Scene,
    next: 'p8Cheese',
  },
  'p8Cheese': {
    id: 'P8Cheese',
    component: P8CheeseScene,
    next: 'p9',
  },
  'p9': {
    id: 'p9',
    component: P9Scene,
    next: 'p10'
  },
  'p10': {
    id: 'p10',
    component: P10Scene,
    next: 'p11',
  },
  'p11': {
    id: 'p11',
    component: P11Scene,
    next: 'p12',
  },
  'p12': {
    id: 'p12',
    component: P12Scene,
    next: 'p13',
  },
  'p13': {
    id: 'p13',
    component: P13Scene,
    next: 'p14',
  },
  'p14': {
    id: 'p14',
    component: P14Scene,
    next: 'p15',
  },
  'p15': {
    id: 'p15',
    component: P15Scene,
    next: 'p16',
  },
  'p16': {
    id: 'p16',
    component: P16Scene,
    next: 'p17',
  },
  'p17': {
    id: 'p17',
    component: P17Scene,
    next: 'p18',
  },
  'p18': {
    id: 'p18',
    component: P18Scene,
    next: 'p19',
  },
  'p19': {
    id: 'p19',
    component: P19Scene,
    next: 'p20',
  },
  'p20': {
    id: 'p20',
    component: P20Scene,
    next: 'p21',
  },
  'p21': {
    id: 'p21',
    component: P21Scene,
    next: 'p22',
  },
  'p22': {
    id: 'p22',
    component: P22Scene,
    next: 'p23',
  },
  'p23': {
    id: 'p23',
    component: P23Scene,
    next: 'p24',
  },
  'p24': {
    id: 'p24',
    component: P24Scene,
    next: 'p25',
  },
  'p25': {
    id: 'p25',
    component: P25Scene,
    next: 'p26',
  },
  'p26': {
    id: 'p26',
    component: P26Scene,
    next: 'p27',
  },
  'p27': {
    id: 'p27',
    component: P27Scene,
    next: 'p28',
  },
  'p28': {
    id: 'p28',
    component: P28Scene,
    next: 'p29',
  },
  'p29': {
    id: 'p29',
    component: P29Scene,
    next: 'ending',
  },
  'ending': {
    id: 'ending',
    component: EndingScene,
  }
};