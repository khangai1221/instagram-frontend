/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { X } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "@/app/components/PostCard";
import { Progress } from "@/components/ui/progress";
import { UserContext } from "@/app/providers/UserProvider";
import { toast, Toaster } from "sonner";

const API_URL = "/api";

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch post independently of user
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${API_URL}/auth/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");

        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        toast.error("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPost();
  }, [id]);

  // Toggle like
  const toggleLike = async () => {
    if (!user || !post) {
      toast.error("You must be logged in to like");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/posts/${post._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      const updatedPost = await res.json();
      setPost({
        ...updatedPost,
        liked: updatedPost.likedUsers.includes(user._id),
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle like");
    }
  };

  // Edit post
  const editPost = async (newDescription: string) => {
    if (!user || !post) return;

    try {
      const res = await fetch(`${API_URL}/auth/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription, userId: user._id }),
      });
      const updated = await res.json();
      if (!res.ok) {
        toast.error(updated.message || "Failed to edit post");
        return;
      }

      setPost({ ...post, description: updated.post.description });
      toast.success("Post updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to edit post");
    }
  };

  // Delete post
  const deletePost = async () => {
    if (!user || !post) return;

    try {
      const res = await fetch(`${API_URL}/auth/posts/${post._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete post");
        return;
      }

      toast.success("Post deleted successfully");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  // Add comment
  const addComment = async (text: string) => {
    if (!user || !post) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          username: user.username,
          text,
        }),
      });
      const updatedPost = await res.json();
      if (!res.ok) {
        toast.error(updatedPost.message || "Failed to add comment");
        return;
      }
      setPost(updatedPost);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Progress />
        <p className="text-gray-500">Loading post...</p>
      </div>
    );

  if (!post)
    return (
      <div className="text-center text-gray-500 mt-10">Post not found.</div>
    );

  return (
    <div className="max-w-xl mx-auto mt-6">
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition"
      >
        <X size={22} />
      </button>

      <Toaster position="top-right" />
      <PostCard
        post={{
          ...post,
          liked: user ? post.likedUsers?.includes(user._id) : false,
        }}
        currentUserId={user?._id || ""}
        toggleLike={toggleLike}
        editPost={(desc) => editPost(desc)}
        deletePost={deletePost}
        addComment={addComment}
      />
    </div>
  );
}
