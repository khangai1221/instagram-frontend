/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import PostCard from "./components/PostCard";
import Stories from "./components/Stories";
import Sidebar from "./components/SideBar";
import { UserContext } from "./providers/UserProvider";
import { toast, Toaster } from "sonner";
import { jwtDecode } from "jwt-decode";

const API_URL = "/api";

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Authenticate user
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/signin");
      return;
    }
    try {
      const payload: any = jwtDecode(storedToken);
      if (!payload.id || !payload.username) throw new Error("Invalid token");

      setUser({
        _id: payload.id,
        username: payload.username,
        fullname: payload.fullname || "No Name",
        email: null,
        phone: null,
      });
    } catch (err) {
      console.error("Invalid JWT:", err);
      localStorage.removeItem("token");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  }, [router, setUser]);

  // Fetch posts
  useEffect(() => {
    if (!user) return;

    async function fetchPosts() {
      try {
        const res = await fetch(`${API_URL}/auth/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setPosts(
          data.map((p: any) => ({
            ...p,
            liked: user ? p.likedUsers?.includes(user._id) ?? false : false,
          }))
        );
      } catch (err) {
        toast.error("Failed to fetch posts");
        console.error("Failed to fetch posts:", err);
      }
    }

    fetchPosts();
  }, [user]);

  // Fetch users for Stories
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setUsers(data.body || []);
      } catch (err) {
        toast.error("Failed to fetch users");
        console.error("Failed to fetch users:", err);
      }
    }

    fetchUsers();
  }, []);

  // Toggle like
  const toggleLike = async (postId: string) => {
    if (!user?._id) return;

    try {
      const res = await fetch(`${API_URL}/auth/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      const updated = await res.json();

      if (!res.ok) {
        toast.error(updated.message || "Failed to toggle like");
        return;
      }

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: updated.likes,
                likedUsers: updated.likedUsers,
                liked: updated.likedUsers.includes(user._id),
              }
            : p
        )
      );

      toast.success(
        updated.likedUsers.includes(user._id) ? "Post liked" : "Post unliked"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle like");
    }
  };

  // Edit post
  const editPost = async (postId: string, newDescription: string) => {
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/auth/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription, userId: user._id }),
      });
      const updated = await res.json();

      if (!res.ok) {
        toast.error(updated.message || "Failed to edit post");
        return;
      }

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, description: updated.post.description } : p
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to edit post");
    }
  };

  // Delete post
  const deletePost = async (postId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/auth/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete post");
        return;
      }

      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  // Add comment
  const addComment = async (postId: string, text: string) => {
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/auth/posts/${postId}/comments`, {
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

      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  if (loading || !user) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-2 sm:px-4">
      <Toaster position="top-right" />

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-[950px] flex flex-col lg:flex-row gap-6">
        {/* Center Feed */}
        <div className="flex-1 max-w-full lg:max-w-[600px] mx-auto">
          <Stories users={users} />

          {posts.map((post) => (
            <div key={post._id} className="mb-6">
              <PostCard
                post={post}
                currentUserId={user._id}
                toggleLike={() => toggleLike(post._id)}
                editPost={(id, desc) => editPost(id, desc)}
                deletePost={(id) => deletePost(id)}
                addComment={(id, text) => addComment(id, text)}
              />
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:flex xl:flex-col w-[320px] gap-6 sticky top-6">
          <Sidebar username={user.username} fullname={user.fullname} />
        </div>
      </div>
    </div>
  );
}
