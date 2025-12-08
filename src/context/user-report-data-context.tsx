"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./auth-context";
import request from "@/lib/request";

// User Report Data Interfaces based on API documentation
export interface UserReportData {
  // Basic activity fields
  publish_question_cnt?: number;
  question_answer_comment_cnt?: number;
  billboard_question_cnt?: number;
  billboard_question_token?: string;
  
  // Answer related fields
  answer_cnt?: number;
  answer_upvote_cnt?: number;
  answer_comment_cnt?: number;
  answer_share_cnt?: number;
  answer_collect_cnt?: number;
  answer_thanks_cnt?: number;
  answer_most_upvote_cnt?: number;
  answer_most_upvote_id?: number;
  answer_most_upvote_title?: string;
  answer_most_upvote_url?: string;
  answer_most_comment_cnt?: number;
  answer_most_comment_id?: number;
  answer_most_comment_title?: string;
  answer_most_comment_url?: string;
  
  // Article related fields
  article_cnt?: number;
  article_upvote_cnt?: number;
  article_comment_cnt?: number;
  article_share_cnt?: number;
  article_collect_cnt?: number;
  article_thanks_cnt?: number;
  article_most_upvote_cnt?: number;
  article_most_upvote_id?: number;
  article_most_upvote_title?: string;
  article_most_upvote_url?: string;
  article_most_comment_cnt?: number;
  article_most_comment_id?: number;
  article_most_comment_title?: string;
  article_most_comment_url?: string;
  
  // Idea/Pin related fields
  pin_cnt?: number;
  pin_upvote_cnt?: number;
  pin_comment_cnt?: number;
  pin_share_cnt?: number;
  pin_collect_cnt?: number;
  pin_thanks_cnt?: number;
  pin_most_upvote_cnt?: number;
  pin_most_upvote_id?: number;
  pin_most_upvote_title?: string;
  pin_most_upvote_url?: string;
  pin_most_comment_cnt?: number;
  pin_most_comment_id?: number;
  pin_most_comment_title?: string;
  pin_most_comment_url?: string;
  
  // Video related fields
  video_cnt?: number;
  video_upvote_cnt?: number;
  video_comment_cnt?: number;
  video_share_cnt?: number;
  video_collect_cnt?: number;
  video_thanks_cnt?: number;
  video_most_upvote_cnt?: number;
  video_most_upvote_id?: number;
  video_most_upvote_title?: string;
  video_most_upvote_url?: string;
  video_most_comment_cnt?: number;
  video_most_comment_id?: number;
  video_most_comment_title?: string;
  video_most_comment_url?: string;
  
  // Question related fields
  question_cnt?: number;
  question_follower_cnt?: number;
  question_answer_cnt?: number;
  question_most_follower_cnt?: number;
  question_most_follower_id?: number;
  question_most_follower_title?: string;
  question_most_follower_url?: string;
  question_most_answer_cnt?: number;
  question_most_answer_id?: number;
  question_most_answer_title?: string;
  question_most_answer_url?: string;
  
  // Topic related fields
  topic_follow_cnt?: number;
  topic_most_follow_id?: number;
  topic_most_follow_name?: string;
  topic_most_follow_url?: string;
  
  // User follow related fields
  user_follow_cnt?: number;
  user_follower_cnt?: number;
  user_follow_most_upvote_id?: number;
  user_follow_most_upvote_name?: string;
  user_follow_most_upvote_url?: string;
  user_follow_most_upvote_upvote_cnt?: number;
  user_follower_most_upvote_id?: number;
  user_follower_most_upvote_name?: string;
  user_follower_most_upvote_url?: string;
  user_follower_most_upvote_upvote_cnt?: number;
  
  // Collection related fields
  collection_cnt?: number;
  collection_follower_cnt?: number;
  collection_most_follower_id?: number;
  collection_most_follower_name?: string;
  collection_most_follower_url?: string;
  
  // Column related fields
  column_cnt?: number;
  column_follower_cnt?: number;
  column_article_cnt?: number;
  column_most_follower_id?: number;
  column_most_follower_name?: string;
  column_most_follower_url?: string;
  column_most_article_id?: number;
  column_most_article_name?: string;
  column_most_article_url?: string;
  column_most_article_cnt?: number;
  
  // Live related fields
  live_cnt?: number;
  live_audience_cnt?: number;
  live_most_audience_id?: number;
  live_most_audience_title?: string;
  live_most_audience_url?: string;
  
  // Club/Community related fields
  club_admin_top1_id?: number;
  club_admin_top1_name?: string;
  club_admin_top1_member_cnt?: number;
  club_admin_top1_content_cnt?: number;
  club_admin_top2_id?: number;
  club_admin_top2_name?: string;
  club_admin_top2_member_cnt?: number;
  club_admin_top2_content_cnt?: number;
  club_admin_pin_cnt?: number;
  club_admin_interaction_cnt?: number;
  
  // Active club fields
  club_active_list_id_top1?: number;
  club_active_list_name_top1?: string;
  club_active_list_id_top2?: number;
  club_active_list_name_top2?: string;
  club_active_list_id_top3?: number;
  club_active_list_name_top3?: string;
  
  // Interest club fields
  club_interest_list_id_top1?: number;
  club_interest_list_name_top1?: string;
  club_interest_list_id_top2?: number;
  club_interest_list_name_top2?: string;
  club_interest_list_id_top3?: number;
  club_interest_list_name_top3?: string;
  club_friend_interest_id?: number;
  club_friend_interest_name?: string;
  
  // Paid content (Salt Select) related fields
  paid_content_cnt?: number;
  total_word_cnt?: number;
  label_name_top1?: string;
  label_name_top2?: string;
  label_name_top3?: string;
  most_favorite_author_name?: string;
  most_favorite_author_num?: number;
  
  // Creator related fields
  write_story_num_sum?: number;
  write_story_most_popular_name?: string;
  total_upvote_num?: number;
  short_story_influence_list?: string;
  annual_author?: string;
  awarded_copy?: string;
  
  // P5: Short content creation fields
  publish_comment_cnt?: number;
  hot_comment_content?: string;
  hot_comment_uv?: number;
  publish_pin_cnt?: number;
  hot_pin_title?: string;
  hot_pin_uv?: number;
  emoji_name?: string;
  emoji_cnt?: number;
  comment_discuss_member_name?: string;
  comment_discuss_cnt?: number;
  
  // P6: Content summary fields
  content_total_word_cnt?: number;
  publish_total_day_cnt?: number;
  publish_max_month?: number;
  publish_most_word_date?: string;
  publish_most_word_cnt?: number;
  
  // P7: Content feedback fields
  content_pv_cnt?: number;
  content_upvote_cnt?: number;
  content_collect_cnt?: number;
  content_comment_cnt?: number;
  content_share_cnt?: number;
  roundtable_cnt?: number;
  recommended_cnt?: number;
  
  // P8: Honor/achievement fields
  zhishi_cnt?: number;
  biz_list_num?: number;
  best_answer_topic?: string;
  is_navigator?: number;
  navigator_upvote_content_cnt?: number;
  
  // Additional fields that might exist
  [key: string]: unknown;
}

interface UserReportDataContextType {
  reportData: UserReportData | null;
  isLoadingReport: boolean;
  error: string | null;
  fetchReportData: () => Promise<void>;
  clearError: () => void;
}

const UserReportDataContext = createContext<UserReportDataContextType | undefined>(undefined);

export function UserReportDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [reportData, setReportData] = useState<UserReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoadingReport(true);
    setError(null);
    try {
      const data = await request<UserReportData>({
        url: "/campaigns/v2/2025/summary/profile",
        method: "get",
      });

      setReportData(data);
    } catch (err: unknown) {
      console.error("Error fetching user report data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "获取年度报告数据失败，请稍后重试";
      setError(errorMessage);
    } finally {
      setIsLoadingReport(false);
    }
  }, [isAuthenticated]);

  // Automatically fetch report data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchReportData();
    } else if (!isAuthenticated) {
      // Clear report data when user logs out
      setReportData(null);
      setError(null);
    }
  }, [isAuthenticated, isAuthLoading, fetchReportData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <UserReportDataContext.Provider
      value={{
        reportData,
        isLoadingReport,
        error,
        fetchReportData,
        clearError,
      }}
    >
      {children}
    </UserReportDataContext.Provider>
  );
}

export function useUserReportData() {
  const context = useContext(UserReportDataContext);
  if (context === undefined) {
    throw new Error("useUserReportData must be used within a UserReportDataProvider");
  }
  return context;
}

