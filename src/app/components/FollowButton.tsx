"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
  initialFollowing?: boolean;
  apiUrl: string;
}

export default function FollowButton({
  currentUserId,
  targetUserId,
  initialFollowing = false,
  apiUrl,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/users/${targetUserId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUserId }),
      });

      if (!res.ok) throw new Error("Failed to toggle follow");

      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error(err);
      alert("Error toggling follow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-1 text-sm font-semibold rounded border ${
        isFollowing
          ? "bg-white text-black border-gray-300"
          : "bg-blue-500 text-white border-blue-500"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
