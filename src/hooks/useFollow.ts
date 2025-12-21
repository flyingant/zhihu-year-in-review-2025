import { useState, useEffect, useCallback } from "react";
import { getFollowStatus, followUser, unfollowUser } from "@/api/report";

export function useFollow(memberToken?: string) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!memberToken) return;

    let mounted = true;

    setIsLoading(true);
    const fetchStatus = async () => {
      try {
        const res = await getFollowStatus(memberToken);
        if (mounted) {
          setIsFollowed(res.is_followed);
        }
      } catch (error) {
        console.error("Failed to fetch follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    return () => {
      mounted = false;
    };
  }, [memberToken]);

  const toggleFollow = useCallback(async () => {
    if (!memberToken) return;

    try {
      if (isFollowed) {
        await unfollowUser({ member_token: memberToken });
        setIsFollowed(false);
      } else {
        await followUser({ member_token: memberToken });
        setIsFollowed(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    }
  }, [memberToken, isFollowed]);

  return { isFollowed, toggleFollow, isLoading};
}
