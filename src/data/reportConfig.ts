import LoadingScene from "@/components/report/scenes/LoadingScene";
import IntroductionScene from "@/components/report/scenes/IntroductionScene";
import IndexScene from "@/components/report/scenes/IndexScene";
import P1Scene from "@/components/report/scenes/P1Scene";
import P2Scene from "@/components/report/scenes/P2Scene";
import P2BillboardScene from "@/components/report/scenes/P2BillboardScene";
import P3Scene from "@/components/report/scenes/P3Scene";
import P4Scene from "@/components/report/scenes/P4Scene";
import P5Scene from "@/components/report/scenes/P5Scene";
import P5EmojiScene from "@/components/report/scenes/P5EmojiScene";
import P6Scene from "@/components/report/scenes/P6Scene";
import P7Scene from "@/components/report/scenes/P7Scene";
import P8Scene from "@/components/report/scenes/P8Scene";
import P8CheeseScene from "@/components/report/scenes/P8CheeseScene";
import P9Scene from "@/components/report/scenes/P9Scene";
import P10Scene from "@/components/report/scenes/P10Scene";
import P11Scene from "@/components/report/scenes/P11Scene";
import P12Scene from "@/components/report/scenes/P12Scene";
import P13Scene from "@/components/report/scenes/P13Scene";
import P14Scene from "@/components/report/scenes/P14Scene";
import P15Scene from "@/components/report/scenes/P15Scene";
import P16Scene from "@/components/report/scenes/P16Scene";
import P17Scene from "@/components/report/scenes/P17Scene";
import P18Scene from "@/components/report/scenes/P18Scene";
import P19Scene from "@/components/report/scenes/P19Scene";
import P20Scene from "@/components/report/scenes/P20Scene";
import P20ClubScene from "@/components/report/scenes/P20ClubScene";
import P21Scene from "@/components/report/scenes/P21Scene";
import P22Scene from "@/components/report/scenes/P22Scene";
import P23Scene from "@/components/report/scenes/P23Scene";
import P24Scene from "@/components/report/scenes/P24Scene";
import P25Scene from "@/components/report/scenes/P25Scene";
import P26Scene from "@/components/report/scenes/P26Scene";
import P27Scene from "@/components/report/scenes/P27Scene";
import P28Scene from "@/components/report/scenes/P28Scene";
import P29Scene from "@/components/report/scenes/P29Scene";
import P30Scene from "@/components/report/scenes/P30Scene";
import EndingScene from "@/components/report/scenes/EndingScene";

import { UserReportData } from "@/api/report";

export type SceneConfig = {
  id: string;
  component: React.ComponentType<any>;
  next?: string | ((choice?: string) => string);
  /**
   * Optional function to determine if this scene should be skipped based on report data.
   * If true, the scene manager will automatically proceed to the next scene.
   */
  shouldSkip?: (data: UserReportData | null) => boolean;
  prepareProps?: (data: Record<string, unknown>) => Record<string, unknown>;
};

export const SCENES: Record<string, SceneConfig> = {
  loading: {
    id: "loading",
    component: LoadingScene,
    next: "introduction", // Loading 完自动去 Intro
  },
  introduction: {
    id: "introintroduction",
    component: IntroductionScene,
    next: "index",
  },
  index: {
    id: "index",
    component: IndexScene,
    next: "p1",
  },
  p1: {
    id: "p1",
    component: P1Scene,
    next: "p2",
  },
  p2: {
    id: "p2",
    component: P2Scene,
    next: "p2Billboard",
    shouldSkip: (data) => !data?.publish_question_cnt,
  },
  p2Billboard: {
    id: "p2Billboard",
    component: P2BillboardScene,
    next: "p3",
    shouldSkip: (data) => !data?.billboard_question_cnt,
  },
  p3: {
    id: "p3",
    component: P3Scene,
    next: "p4",
    shouldSkip: (data) => !data?.publish_answer_cnt && !data?.publish_article_cnt,
  },
  p4: {
    id: "p4",
    component: P4Scene,
    next: "p5",
    shouldSkip: (data) =>
      (data?.answer_most_upvote_cnt ?? 0) < 50 && !data?.answer_1k_upvote_cnt,
  },
  p5: {
    id: "p5",
    component: P5Scene,
    next: "p5Emoji",
    shouldSkip: (data) => !data?.publish_comment_cnt && !data?.publish_pin_cnt,
  },
  p5Emoji: {
    id: "p5Emoji",
    component: P5EmojiScene,
    next: "p6",
    shouldSkip: (data) =>
      !data?.emoji_name && !data?.comment_discuss_member_name,
  },
  p6: {
    id: "p6",
    component: P6Scene,
    next: "p7",
    shouldSkip: (data) => !data?.content_total_word_cnt,
  },
  p7: {
    id: "p7",
    component: P7Scene,
    next: "p8",
    shouldSkip: (data) => !data?.content_pv_cnt && !data?.roundtable_cnt,
  },
  p8: {
    id: "p8",
    component: P8Scene,
    next: "p8Cheese",
    shouldSkip: (data) => !data?.zhishi_cnt && !data?.biz_list_num && !data?.best_answer_topic && !data?.is_navigator,
  },
  p8Cheese: {
    id: "P8Cheese",
    component: P8CheeseScene,
    next: "p9",
    shouldSkip: (data) =>
      !data?.cheese_student_name && !data?.cheese_award_list,
  },
  p9: {
    id: "p9",
    component: P9Scene,
    next: "p10",
  },
  p10: {
    id: "p10",
    component: P10Scene,
    next: "p11",
    shouldSkip: (data) => !data?.consume_word_cnt,
  },
  p11: {
    id: "p11",
    component: P11Scene,
    next: "p12",
    shouldSkip: (data) =>
      !data?.browse_most_category_top1 &&
      !data?.browse_most_category_top2 &&
      !data?.browse_most_category_top3 &&
      !(data?.add_category_list?.length && !data?.reduce_category_list?.length),
  },
  p12: {
    id: "p12",
    component: P12Scene,
    next: "p13",
    shouldSkip: (data) => !data?.zhihu_browse_last_date,
  },
  p13: {
    id: "p13",
    component: P13Scene,
    next: "p14",
    shouldSkip: (data) =>
      !data?.zhihu_browse_most_date &&
      (data?.zhihu_browse_most_date_duration ?? 0) < 5 &&
      !data?.consume_most_answer_title &&
      (data?.consume_most_answer_pv_cnt ?? 0) < 5,
  },
  p14: {
    id: "p14",
    component: P14Scene,
    next: "p15",
  },
  p15: {
    id: "p15",
    component: P15Scene,
    next: "p16",
    shouldSkip: (data) =>
      !data?.new_follow_cnt &&
      !data?.most_upvote_member_name &&
      !data?.thanks_invitation_member_name,
  },
  p16: {
    id: "p16",
    component: P16Scene,
    next: "p17",
    shouldSkip: (data) =>
      !data?.send_upvote_cnt &&
      !data?.consume_member_name &&
      !data?.consume_interest_member_name_top1 &&
      !data?.consume_interest_member_name_top2 &&
      !data?.consume_interest_member_name_top3,
  },
  p17: {
    id: "p17",
    component: P17Scene,
    next: "p18",
    shouldSkip: (data) =>
      !data?.follow_question_friend && !data?.upvote_hot_answer_member_name,
  },
  p18: {
    id: "p18",
    component: P18Scene,
    next: "p19",
    shouldSkip: (data) =>
      !data?.club_admin_top1_name &&
      !data?.club_admin_top2_name
  },
  p19: {
    id: "p19",
    component: P19Scene,
    next: "p20",
    shouldSkip: (data) =>
      !data?.join_club_cnt &&
      !data?.consume_most_club_name &&
      !data?.interactive_most_club_name,
  },
  p20: {
    id: "p20",
    component: P20Scene,
    next: "p20Club",
    shouldSkip: (data) =>
      !data?.club_friend_cnt &&
      !data?.most_interaction_club_member_name_top1 &&
      !data?.most_interaction_club_member_name_top2 &&
      !data?.most_interaction_club_member_name_top3,
  },
  p20Club: {
    id: "p20Club",
    component: P20ClubScene,
    next: "p21",
    shouldSkip: (data) =>
      !data?.club_active_list_name_top1 &&
      !data?.club_active_list_name_top2 &&
      !data?.club_active_list_name_top3 &&
      !data?.club_interest_list_name_top1 &&
      !data?.club_interest_list_name_top2 &&
      !data?.club_interest_list_name_top3,
  },
  p21: {
    id: "p21",
    component: P21Scene,
    next: "p22",
  },
  p22: {
    id: "p22",
    component: P22Scene,
    next: "p23",
    shouldSkip: (data) =>
      (!data?.consume_billboard_days || data?.consume_billboard_days < 5) &&
      !data?.consume_billboard_content_cnt &&
      !data?.event_name &&
      !data?.upvote_zhihu_billboard_content_cnt
  },
  p23: {
    id: "p23",
    component: P23Scene,
    next: "p24",
    shouldSkip: (data) =>
      !data?.review_answer_cnt
  },
  p24: {
    id: "p24",
    component: P24Scene,
    next: "p25",
    shouldSkip: (data) =>
      !data?.movie_like_cnt &&
      !data?.movie_like_name_top1 &&
      !data?.movie_like_name_top2 &&
      !data?.movie_like_name_top3,
  },
  p25: {
    id: "p25",
    component: P25Scene,
    next: "p26",
    shouldSkip: (data) =>
      !data?.paid_content_cnt &&
      !data?.total_word_cnt &&
      !data?.label_name_top1 &&
      !data?.label_name_top2 &&
      !data?.label_name_top3 &&
      !data?.most_favorite_author_name,
  },
  p26: {
    id: "p26",
    component: P26Scene,
    next: "p27",
    shouldSkip: (data) =>
      !data?.write_story_num_sum &&
      !data?.total_upvote_num &&
      !data?.write_story_most_popular_name &&
      !data?.short_story_influence_list &&
      !data?.annual_author && 
      !data?.awarded_copy
  },
  p27: {
    id: "p27",
    component: P27Scene,
    next: "p28",
  },
  p28: {
    id: "p28",
    component: P28Scene,
    next: "p29",
  },
  p29: {
    id: "p29",
    component: P29Scene,
    next: "p30",
  },
  p30: {
    id: "30",
    component: P30Scene,
    next: "ending",
  },
  ending: {
    id: "ending",
    component: EndingScene,
  },
};
