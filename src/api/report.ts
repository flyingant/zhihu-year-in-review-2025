// src/api/report.ts
import request, { authRequest } from "../lib/request";

// ============================================================================
// User Report Data Interface
// ============================================================================
// This interface represents the complete user annual report data structure
// returned from the /campaigns/v2/2025/summary/profile endpoint
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
  best_answer_topic?: string[];
  is_navigator?: number;
  navigator_upvote_content_cnt?: number;
  
  // P13: Time spent
  zhihu_browse_most_date?: string;
  zhihu_browse_most_date_duration?: number;
  consume_most_answer_title?: string;
  consume_most_answer_pv_cnt?: number;
  
  // P15: Social/Follow related fields
  new_follow_cnt?: number;
  most_upvote_member_name?: string;
  most_upvote_member_upvote?: number;
  interaction_most_member_name?: string;
  thanks_invitation_date?: string | number;
  thanks_invitation_question_title?: string;
  thanks_invitation_member_name?: string;

  // P17: Social interaction content
  follow_question_friend?: number;
  follow_question_friend_question_title?: string;
  upvote_hot_answer_member_name?: string;
  upvote_hot_answer_title?: string;
  upvote_hot_answer_upvote_cnt?: number;
  upvote_hot_answer_user_cnt?: number;

  // P19: Club/Community participation
  join_club_cnt?: number;
  join_club_percentage?: number;
  consume_most_club_name?: string;
  consume_most_club_pv?: number;
  interactive_most_club_name?: string;
  interactive_most_club_comment_cnt?: number;
  interactive_most_club_upvote_cnt?: number;
  interaction_most_pin_club_name?: string;
  interaction_most_pin_title?: string;
  interaction_most_pin_interaction_cnt?: number;

  // P20
  most_interaction_club_member_avatar_top1?: string;
  most_interaction_club_member_avatar_top2?: string;
  most_interaction_club_member_avatar_top3?: string;
  club_interest_list_avatar_top1?: string;
  club_interest_list_avatar_top2?: string;
  club_interest_list_avatar_top3?: string;

  // P22: Billboard/Hot Events related fields
  consume_billboard_days?: number;
  consume_billboard_content_cnt?: number;
  upvote_zhihu_billboard_content_cnt?: number;
  event_month?: number;
  event_name?: string;
  event_upvote_cnt?: number;
  event_member_cnt?: number;
  event_most_hour_name?: string;
  event_most_hour?: number;

  // P24: Movie/Film related fields
  movie_like_cnt?: number;
  movie_like_name_top1?: string;
  movie_like_rate_top1?: number | string;
  movie_like_url_top1?: string;
  movie_like_name_top2?: string;
  movie_like_rate_top2?: number | string;
  movie_like_url_top2?: string;
  movie_like_name_top3?: string;
  movie_like_rate_top3?: number | string;
  movie_like_url_top3?: string;

  // P11: Category browsing and changes
  browse_most_category_top1?: string;
  browse_most_category_top2?: string;
  browse_most_category_top3?: string;
  add_category_list?: string[];
  reduce_category_list?: string[];

  // Additional fields that might exist
  [key: string]: unknown;
}

// ============================================================================
// 1. User Follow Status API
// ============================================================================
/**
 * Response interface for user follow status
 */
export interface FollowStatusResponse {
  is_followed: boolean; // Whether the user is already following the target user
}

/**
 * 用户关注状态接口
 * Query the follow status of the current user for a specific target user
 *
 * @param memberToken - User identifier token for the target user
 * @returns Promise<FollowStatusResponse> - Follow status information
 *
 * @example
 * const status = await getFollowStatus('abc123');
 * if (status.is_followed) {
 *   console.log('Already following this user');
 * }
 */
export const getFollowStatus = (memberToken: string) => {
  return request<FollowStatusResponse>({
    url: "/campaigns/v2/2025/follow/status",
    method: "GET",
    params: {
      member_token: memberToken,
    },
  });
};

// ============================================================================
// 2. User Follow Action API
// ============================================================================
/**
 * Request parameters for following a user
 */
export interface FollowUserRequest {
  member_token: string; // User identifier token for the target user to follow
}

/**
 * 用户关注操作接口
 * Follow a specific user
 *
 * @param params - Follow request parameters containing member_token
 * @returns Promise<null> - Success response (no data returned)
 *
 * @example
 * await followUser({ member_token: 'abc123' });
 */
export const followUser = (params: FollowUserRequest) => {
  return request<null>({
    url: "/campaigns/v2/2025/follow",
    method: "POST",
    data: params,
  });
};

// ============================================================================
// 3. User Unfollow Action API
// ============================================================================
/**
 * Request parameters for unfollowing a user
 */
export interface UnfollowUserRequest {
  member_token: string; // User identifier token for the target user to unfollow
}

/**
 * 用户取消关注操作接口
 * Unfollow a specific user
 *
 * @param params - Unfollow request parameters containing member_token
 * @returns Promise<null> - Success response (no data returned)
 *
 * @example
 * await unfollowUser({ member_token: 'abc123' });
 */
export const unfollowUser = (params: UnfollowUserRequest) => {
  return request<null>({
    url: "/campaigns/v2/2025/unfollow",
    method: "POST",
    data: params,
  });
};

// ============================================================================
// 4. User Quiz Answer API
// ============================================================================
/**
 * Request parameters for submitting a quiz answer
 */
export interface QuizAnswerRequest {
  question_id: number; // Question ID/number
  answer: string; // User's answer (e.g., "A", "B", etc.)
}

/**
 * Response interface for quiz answer submission
 */
export interface QuizAnswerResponse {
  result: string; // Quiz result or prompt message (e.g., "答题成功,您的性格类型是...")
}

/**
 * 用户答题接口
 * Submit user's answer to a quiz question
 *
 * @param params - Quiz answer request parameters
 * @returns Promise<QuizAnswerResponse> - Quiz result or prompt message
 *
 * @example
 * const result = await submitQuizAnswer({
 *   question_id: 1,
 *   answer: 'A'
 * });
 * console.log(result.result); // "答题成功,您的性格类型是..."
 */
export const submitQuizAnswer = (params: QuizAnswerRequest) => {
  return request<QuizAnswerResponse>({
    url: "/campaigns/v2/2025/quiz/answer",
    method: "POST",
    data: params,
  });
};

// ============================================================================
// 5. Summary Poster Generation API
// ============================================================================
/**
 * Request parameters for generating a summary poster
 */
export interface GenerateSummaryPosterRequest {
  text: string; // User's summary text input (e.g., "我真的 XXX 了")
  test_member_id?: string; // Optional test member ID for testing purposes
}

/**
 * Response interface for summary poster generation
 */
export interface GenerateSummaryPosterResponse {
  poster_id: number; // Unique poster identifier ID
  poster_url: string; // Poster image access URL (CDN address)
}

/**
 * 个人总结海报生成接口
 * Generate a personal summary poster based on user's input text
 * Note: This is an asynchronous operation, client should show loading indicator
 *
 * @param params - Poster generation request parameters
 * @returns Promise<GenerateSummaryPosterResponse> - Generated poster information
 *
 * @example
 * const poster = await generateSummaryPoster({
 *   text: '我真的 XXX 了'
 * });
 * console.log(poster.poster_url); // "https://pic.zhihu.com/posters/2025/summary_123456.jpg"
 */
export const generateSummaryPoster = (params: GenerateSummaryPosterRequest) => {
  return request<GenerateSummaryPosterResponse>({
    url: "/campaigns/v2/2025/summary_poster/generate",
    method: "POST",
    data: params,
  });
};

// ============================================================================
// 6. Summary Poster Publish Pin API
// ============================================================================
/**
 * Request parameters for publishing a summary poster as a pin
 */
export interface PublishSummaryPosterRequest {
  poster_id: number; // Unique poster identifier ID (from generateSummaryPoster)
}

/**
 * 个人总结海报发想法接口
 * Publish the generated summary poster as a pin (想法)
 *
 * @param params - Publish request parameters containing poster_id
 * @returns Promise<null> - Success response (no data returned)
 *
 * @example
 * // First generate the poster
 * const poster = await generateSummaryPoster({ text: '我真的 XXX 了' });
 * // Then publish it as a pin
 * await publishSummaryPoster({ poster_id: poster.poster_id });
 */
export const publishSummaryPoster = (params: PublishSummaryPosterRequest) => {
  return request<null>({
    url: "/campaigns/v2/2025/summary_poster/publish_pin",
    method: "POST",
    data: params,
  });
};

// ============================================================================
// 7. Personal Image Option API
// ============================================================================
/**
 * Response interface for personal image option information
 */
export interface PersonalImageOptionResponse {
  correct_option: string; // The correct personal image option (e.g., "真诚友善的知友")
  poster_id: number; // Poster ID, used for subsequent vote association
}

/**
 * 获取用户个人形象选择信息接口
 * Get user's personal image option information
 *
 * @param posterId - Poster ID
 * @returns Promise<PersonalImageOptionResponse> - Personal image option information
 *
 * @example
 * const option = await getPersonalImageOption(123);
 * console.log(option.correct_option); // "真诚友善的知友"
 */
export const getPersonalImageOption = (posterId: number) => {
  return request<PersonalImageOptionResponse>({
    url: "/campaigns/v2/2025/personal_image_option",
    method: "GET",
    params: {
      poster_id: posterId,
    },
  });
};

// ============================================================================
// 8. Set Vote Option API
// ============================================================================
/**
 * Request parameters for setting vote options
 */
export interface SetVoteOptionRequest {
  poster_id: number; // Poster ID for vote association
  publish_pin?: boolean; // Whether to publish as a pin (optional, default: false)
  custom_options?: string[]; // User-defined custom vote options list (optional)
}

/**
 * Response interface for set vote option
 */
export interface SetVoteOptionResponse {
  poll_id?: string; // Poll ID for the created vote
}

/**
 * 设置投票选项接口
 * Set vote options for a generated poster
 * Supports optional publishing as a pin and submitting custom vote options
 *
 * @param params - Vote option request parameters
 * @returns Promise<SetVoteOptionResponse> - Success response with poll_id
 *
 * @example
 * await setVoteOption({
 *   poster_id: 1234,
 *   publish_pin: true,
 *   custom_options: ['选项1', '选项2']
 * });
 */
export const setVoteOption = (params: SetVoteOptionRequest) => {
  return request<SetVoteOptionResponse>({
    url: "/campaigns/v2/2025/poll/setup",
    method: "POST",
    data: params,
  });
};

// ============================================================================
// 9. Get Vote Info API
// ============================================================================
/**
 * Vote option information
 */
export interface VoteOptionInfo {
  option_id: number; // Vote option ID
  option_text?: string; // Vote option text
  option_name?: string; // Vote option name (alternative to option_text)
  vote_count?: number; // Number of votes for this option (if available)
  vote_num?: number; // Number of votes (alternative field name)
  vote_percent?: string; // Vote percentage as string
  is_correct?: number; // Whether this option is correct (1 = correct, 0 = incorrect)
  is_voted?: number; // Whether user voted for this option (1 = voted, 0 = not voted)
}

/**
 * Response interface for vote information
 */
export interface VoteInfoResponse {
  poster_id: number; // Poster ID
  vote_id: number; // Vote ID
  vote_title: string; // Vote title
  options: VoteOptionInfo[]; // List of vote options
  total_votes?: number; // Total number of votes (if available)
  user_voted?: boolean; // Whether the current user has voted (if available)
  user_vote_option_id?: number; // User's voted option ID (if available)
  username?: string; // Username
  is_vote_correct?: number; // Whether the vote is correct (0 = incorrect, 1 = correct, 2 = not voted yet)
  transformedOptions?: Array<VoteOptionInfo & { key: string }>; // Transformed options with key property
}

/**
 * 获取投票信息接口
 * Get vote information for a specific poll
 *
 * @param pollId - Poll ID
 * @returns Promise<VoteInfoResponse> - Vote information including options and statistics
 *
 * @example
 * const voteInfo = await getVoteInfo(1234);
 * console.log(voteInfo.vote_title);
 * voteInfo.options.forEach(option => {
 *   console.log(`${option.option_text}: ${option.vote_count} votes`);
 * });
 */
export const getVoteInfo = (pollId: string) => {
  return request<VoteInfoResponse>({
    url: "/campaigns/v2/2025/poll_info",
    method: "GET",
    params: {
      poll_id: pollId,
    },
  });
};

// ============================================================================
// 10. Submit Vote API
// ============================================================================
/**
 * Request parameters for submitting a vote
 */
export interface SubmitVoteRequest {
  poster_id: number; // Poster ID
  option_id: number; // Selected vote option ID
}

/**
 * Response interface for vote submission
 */
export interface SubmitVoteResponse {
  success: boolean; // Whether the vote was successfully submitted
  vote_count?: number; // Updated vote count for the selected option (if available)
  total_votes?: number; // Updated total vote count (if available)
}

/**
 * 投票提交接口
 * Submit a vote for a specific poster
 *
 * @param params - Vote submission request parameters
 * @returns Promise<SubmitVoteResponse> - Vote submission result
 *
 * @example
 * const result = await submitVote({
 *   poster_id: 1234,
 *   option_id: 1
 * });
 * if (result.success) {
 *   console.log('Vote submitted successfully');
 * }
 */
export const submitVote = (params: SubmitVoteRequest) => {
  return request<SubmitVoteResponse>({
    url: "/campaigns/v2/2025/submit_vote",
    method: "POST",
    data: params,
  });
};

// ============================================================================
// 11. User Annual Summary Profile API
// ============================================================================
/**
 * 用户个人年终总结信息接口
 * Get user's annual summary report data
 * This endpoint returns comprehensive user activity data for the year
 * Note: Data is sourced from data warehouse and updated daily
 *
 * @param params - Optional query params (e.g., test_member_id for testing)
 * @returns Promise<UserReportData> - Complete user annual report data
 *
 * @example
 * const reportData = await getUserReportData();
 * console.log(`Published ${reportData.answer_cnt} answers`);
 * console.log(`Most upvoted answer: ${reportData.answer_most_upvote_title}`);
 */
export const getUserReportData = (params?: { test_member_id?: string }) => {
  const baseUrl = "/campaigns/v2/2025/summary/profile";
  const url = params?.test_member_id
    ? `${baseUrl}?test_member_id=${encodeURIComponent(params.test_member_id)}`
    : baseUrl;

  return request<UserReportData>({
    url,
    method: "GET",
  });
};

// ============================================================================
// 12. Circle Membership Status API
// ============================================================================
/**
 * Response interface for circle membership status
 */
export interface CircleMembershipStatusResponse {
  is_joined: boolean; // Whether the user has joined the circle
  ring_id: string; // Circle ID
}

/**
 * 查询用户加入圈子状态接口
 * Query the membership status of the current user for a specific circle
 * 
 * @param ringId - Circle identifier (ring_id)
 * @returns Promise<CircleMembershipStatusResponse> - Membership status information
 * 
 * @example
 * const status = await getCircleMembershipStatus('abc123');
 * if (status.is_joined) {
 *   console.log('User has joined this circle');
 * }
 */
export const getCircleMembershipStatus = (ringId: string) => {
  return request<CircleMembershipStatusResponse>({
    url: `/rings/v1/${ringId}/membership`,
    method: 'GET',
  });
};

// ============================================================================
// 13. Join Circle API
// ============================================================================
/**
 * Response interface for joining a circle
 */
export interface JoinCircleResponse {
  message: string; // Response message (e.g., "已加入圈子")
  success: boolean; // Whether the operation was successful
}

/**
 * 用户加入圈子接口
 * Join a specific circle
 * 
 * @param ringId - Circle identifier (ring_id)
 * @returns Promise<JoinCircleResponse> - Join operation result
 * 
 * @example
 * const result = await joinCircle('abc123');
 * if (result.success) {
 *   console.log(result.message); // "已加入圈子"
 * }
 */
export const joinCircle = (ringId: string) => {
  return request<JoinCircleResponse>({
    url: `/rings/v1/${ringId}/membership`,
    method: 'POST',
  });
};

// ============================================================================
// 14. Leave Circle API
// ============================================================================
/**
 * Response interface for leaving a circle
 */
export interface LeaveCircleResponse {
  message: string; // Response message (usually empty string)
  success: boolean; // Whether the operation was successful
}

/**
 * 用户退出圈子接口
 * Leave a specific circle
 * 
 * @param ringId - Circle identifier (ring_id)
 * @returns Promise<LeaveCircleResponse> - Leave operation result
 * 
 * @example
 * const result = await leaveCircle('abc123');
 * if (result.success) {
 *   console.log('Successfully left the circle');
 * }
 */
export const leaveCircle = (ringId: string) => {
  return request<LeaveCircleResponse>({
    url: `/rings/v1/${ringId}/membership`,
    method: 'DELETE',
  });
};

// ============================================================================
// 15. Send Message API
// ============================================================================
/**
 * Request parameters for sending a message
 */
export interface SendMessageRequest {
  receiver_id: string; // Receiver user ID
  text: string; // Message text content
  content_type?: number; // Content type (default: 0)
}

/**
 * Response interface for sending a message
 */
export interface SendMessageResponse {
  success?: boolean; // Whether the operation was successful
  message?: string; // Response message (if any)
}

/**
 * 发送私信接口
 * Send a private message to a user
 * 
 * @param params - Message request parameters containing receiver_id and text
 * @returns Promise<SendMessageResponse> - Send operation result
 * 
 * @example
 * const result = await sendMessage({
 *   receiver_id: 'user123',
 *   text: 'Hello!'
 * });
 * if (result.success) {
 *   console.log('Message sent successfully');
 * }
 */
export const sendMessage = (params: SendMessageRequest) => {
  return authRequest<SendMessageResponse>({
    url: '/chat',
    method: 'POST',
    data: {
      content_type: params.content_type ?? 0,
      receiver_id: params.receiver_id,
      text: params.text,
    },
  });
};
